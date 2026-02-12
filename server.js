import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
if (!OPENROUTER_API_KEY) {
  console.warn("⚠️  OPENROUTER_API_KEY not found in .env");
} else {
  console.log("✅ OpenRouter API initialized");
}

const SYSTEM_PROMPT = `You are a Physics Problem Solver. Extract ALL numeric values, identify physics domain, select correct formulas, and calculate results.

CRITICAL EXTRACTION RULES:
1. Extract EVERY number from the problem with its variable name
2. For projectile/motion: MUST extract velocity (v, v0, initial_velocity), height (h), angle
3. For collisions: MUST extract m1, m2, v1, v2
4. For circular motion: MUST extract velocity (v), radius (r), centripetal acceleration (ac)
5. Always include units (m, m/s, kg, s, etc.)
6. Use standard physics variable names in extracted_values keys
7. Assume SI units unless specified otherwise
8. Return ONLY valid JSON - no text before or after

REQUIRED EXTRACTED_VALUES FORMAT:
- For projectile: {"velocity": {"value": 15, "unit": "m/s"}, "height": {"value": 25, "unit": "m"}, "angle": {"value": 30, "unit": "degrees"}}
- For collision: {"m1": {"value": 3, "unit": "kg"}, "v1": {"value": 10, "unit": "m/s"}, "m2": {"value": 5, "unit": "kg"}, "v2": {"value": 2, "unit": "m/s"}}
- For circular: {"velocity": {"value": 20, "unit": "m/s"}, "radius": {"value": 50, "unit": "m"}}

RESPONSE JSON STRUCTURE:
{
  "domain": "identified physics domain (kinematics, dynamics, circular motion, collisions, etc)",
  "problem_description": "user problem restated clearly",
  "extracted_values": {each variable with value and unit},
  "unknowns": ["what we are solving for"],
  "formulas_used": ["formula1", "formula2"],
  "calculation_steps": [
    {"step": "step description", "explanation": "why this step", "formula": "mathematical formula", "calculation": "detailed work", "value": "result with unit"}
  ],
  "final_answer": "summary of key result",
  "sanity_check": "is this answer physically reasonable"
}

VALIDATION:
- All extracted_values MUST come from problem statement (no guessing)
- All formulas MUST be standard physics equations
- All calculations MUST be mathematically correct
- Results MUST include proper units
- Each different input must produce different output

OUTPUT REQUIREMENT: Return ONLY the JSON object, nothing else.`;

function transformResponse(apiOutput) {
  const response = JSON.parse(apiOutput);
  return {
    title: response.domain || "Physics Problem",
    description: response.problem_description || "",
    motion_type: mapDomainToMotionType(response),
    objects: extractObjects(response.extracted_values),
    initial_conditions: extractConditions(response.extracted_values),
    forces: response.formulas_used || [],
    equations: response.formulas_used || [],
    unknowns: response.unknowns || [],
    solution_steps: (response.calculation_steps || []).map((step) => ({
      step: step.step,
      explanation: step.explanation,
      formula: step.formula,
      value: step.value,
    })),
  };
}

function mapDomainToMotionType(response) {
  const domain = (response.domain || "").toLowerCase();
  const unknowns = (response.unknowns || []).map(u => u.toLowerCase()).join(" ");
  const formulas = (response.formulas_used || []).map(f => f.toLowerCase()).join(" ");
  const description = (response.problem_description || "").toLowerCase();
  
  // Check for collision
  if (domain.includes("collision") || (unknowns.includes("velocity") && unknowns.includes("collision"))) {
    return "collision_1d";
  }
  
  // Check for circular motion
  if (domain.includes("circular") || formulas.includes("centripetal") || unknowns.includes("centripetal")) {
    return "circular";
  }
  
  // Check for free fall
  if (domain.includes("free fall") || description.includes("drop") || description.includes("falls from")) {
    if (!description.includes("horizontal") && !description.includes("thrown")) {
      return "free_fall";
    }
  }
  
  // Check for projectile motion (thrown, horizontal, angle, range, trajectory, distance)
  if (formulas.includes("range") || unknowns.includes("distance") || unknowns.includes("horizontal") || 
      description.includes("thrown") || description.includes("horizontal") || description.includes("angle")) {
    return "projectile";
  }
  
  // Default kinematics to projectile if it has velocity/height (common projectile setup)
  if (domain.includes("kinematic") && (description.includes("thrown") || description.includes("horizontal"))) {
    return "projectile";
  }
  
  return "linear_acceleration";
}

function extractObjects(extractedValues) {
  if (!extractedValues) return [{ name: "Object", mass: 1 }];
  let mass = 1;
  if (extractedValues.mass?.value) mass = extractedValues.mass.value;
  else if (extractedValues.m?.value) mass = extractedValues.m.value;
  else if (extractedValues.m1?.value) mass = extractedValues.m1.value;
  return [{ name: "Object", mass }];
}

function extractConditions(extractedValues) {
  const conditions = { gravity: 9.8 };
  if (!extractedValues) return conditions;
  
  // Extract velocity (multiple possible names)
  if (extractedValues.velocity?.value) {
    conditions.velocity = extractedValues.velocity.value;
  } else if (extractedValues.v?.value) {
    conditions.velocity = extractedValues.v.value;
  } else if (extractedValues.initial_velocity?.value) {
    conditions.velocity = extractedValues.initial_velocity.value;
  } else if (extractedValues.v0?.value) {
    conditions.velocity = extractedValues.v0.value;
  }
  
  // Extract angle (multiple possible names)
  if (extractedValues.angle?.value) {
    conditions.angle = extractedValues.angle.value;
  } else if (extractedValues.θ?.value) {
    conditions.angle = extractedValues.θ.value;
  } else if (extractedValues.theta?.value) {
    conditions.angle = extractedValues.theta.value;
  }
  
  // Extract height (multiple possible names)
  if (extractedValues.height?.value) {
    conditions.height = extractedValues.height.value;
  } else if (extractedValues.h?.value) {
    conditions.height = extractedValues.h.value;
  }
  
  // Extract radius
  if (extractedValues.radius?.value) {
    conditions.radius = extractedValues.radius.value;
  } else if (extractedValues.r?.value) {
    conditions.radius = extractedValues.r.value;
  }
  
  // Extract collision velocities
  if (extractedValues.v1?.value) conditions.v1 = extractedValues.v1.value;
  if (extractedValues.v2?.value) conditions.v2 = extractedValues.v2.value;
  
  // Extract collision masses
  if (extractedValues.m1?.value) conditions.m1 = extractedValues.m1.value;
  if (extractedValues.m2?.value) conditions.m2 = extractedValues.m2.value;
  
  return conditions;
}

app.post("/api/parse", async (req, res) => {
  try {
    const { problem } = req.body;

    if (!problem || !problem.trim()) {
      return res.status(400).json({ error: "Problem text required" });
    }

    if (!OPENROUTER_API_KEY) {
      return res.status(500).json({
        error: "AI service not configured",
        message: "OPENROUTER_API_KEY not set",
      });
    }

    console.log(`\n📝 Problem: "${problem.substring(0, 50)}..."`);
    console.log("🤖 Calling OpenRouter...");

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `Solve and return ONLY JSON:\n\n${problem}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": "http://localhost:5000",
          "X-Title": "PhysiViz AI",
        },
      }
    );
    const responseText = response.data.choices[0].message.content;
    console.log("✅ Received response");

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(responseText);
    } catch {
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[1]);
      } else {
        throw new Error("Invalid JSON");
      }
    }

    if (parsedResponse.error) {
      return res.status(400).json({
        error: parsedResponse.error,
        message: parsedResponse.error,
      });
    }

    const transformed = transformResponse(JSON.stringify(parsedResponse));
    console.log(`✨ Domain: ${transformed.title}`);

    res.json({ success: true, result: transformed });
  } catch (error) {
    console.error("❌ Error:", error.response?.data?.error || error.message);
    res.status(500).json({
      error: "Failed to process",
      message: error.response?.data?.error?.message || error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server: http://localhost:${PORT}`);
  console.log(`${OPENROUTER_API_KEY ? "✅ OpenRouter connected" : "⚠️  Not configured"}`);
  console.log(`\n📡 Ready...\n`);
});
