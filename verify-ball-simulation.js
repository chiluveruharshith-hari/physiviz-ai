import axios from "axios";

const API_URL = "http://localhost:5000/api/parse";

console.log("\n" + "=".repeat(70));
console.log("🎯 BALL SIMULATION & GRAPHS VERIFICATION TEST");
console.log("=".repeat(70) + "\n");

// Test projectile motion (ball simulation)
const projectileProblem = "A ball is thrown horizontally at 15 m/s from a 25m building. How far does it travel?";

try {
  console.log("📝 Testing Projectile Motion (Ball Simulation)...\n");
  
  const response = await axios.post(API_URL, { problem: projectileProblem });
  const result = response.data.result;
  
  // Check for required simulation data
  const checks = {
    "✓ Motion Type = PROJECTILE": result.motion_type === "projectile",
    "✓ Velocity extracted": result.initial_conditions.velocity !== undefined && result.initial_conditions.velocity > 0,
    "✓ Height extracted": result.initial_conditions.height !== undefined && result.initial_conditions.height > 0,
    "✓ Gravity set": result.initial_conditions.gravity === 9.8,
    "✓ Objects array": Array.isArray(result.objects) && result.objects.length > 0,
    "✓ Solution steps": Array.isArray(result.solution_steps) && result.solution_steps.length > 0,
  };
  
  console.log("🔍 SIMULATION DATA CHECKS:");
  console.log("-".repeat(70));
  
  let allPassed = true;
  for (const [check, passed] of Object.entries(checks)) {
    console.log(`${passed ? "✅" : "❌"} ${check}`);
    if (!passed) allPassed = false;
  }
  
  console.log("\n📊 EXTRACTED SIMULATION PARAMETERS:");
  console.log("-".repeat(70));
  console.log(`Velocity (for ball speed):     ${result.initial_conditions.velocity} m/s`);
  console.log(`Height (for trajectory):      ${result.initial_conditions.height} m`);
  console.log(`Angle (for ball direction):   ${result.initial_conditions.angle || 0}°`);
  console.log(`Gravity:                      ${result.initial_conditions.gravity} m/s²`);
  console.log(`Ball mass:                    ${result.objects[0]?.mass || 1} kg`);
  
  console.log("\n📈 GRAPH RENDERING DATA:");
  console.log("-".repeat(70));
  console.log(`Motion type supports graphs:  ${result.motion_type === "projectile" ? "YES" : "NO"}`);
  console.log(`Velocity available:           ${result.initial_conditions.velocity ? "YES" : "NO"}`);
  console.log(`Height available:             ${result.initial_conditions.height ? "YES" : "NO"}`);
  console.log(`Gravity available:            ${result.initial_conditions.gravity ? "YES" : "NO"}`);
  
  console.log("\n🎬 SIMULATOR INITIALIZATION CHECK:");
  console.log("-".repeat(70));
  
  // Simulate what the Simulator component would do
  const velocity = result.initial_conditions.velocity || 0;
  const angle = result.initial_conditions.angle || 0;
  const height = result.initial_conditions.height || 0;
  const gravity = result.initial_conditions.gravity || 9.8;
  
  const rad = (angle * Math.PI) / 180;
  const vx = velocity * Math.cos(rad);
  const vy0 = -velocity * Math.sin(rad);
  
  console.log(`Initial horizontal velocity (vx): ${vx.toFixed(2)} m/s`);
  console.log(`Initial vertical velocity (vy0):  ${vy0.toFixed(2)} m/s`);
  
  // Calculate time of flight
  const timeOfFlight = Math.sqrt(2 * height / gravity);
  const horizontalDistance = vx * timeOfFlight;
  
  console.log(`Time of flight:                   ${timeOfFlight.toFixed(2)} s`);
  console.log(`Horizontal distance:              ${horizontalDistance.toFixed(2)} m`);
  
  console.log("\n🎨 CANVAS RENDERING READ:");
  console.log("-".repeat(70));
  console.log(`Motion type check:            ${result.motion_type === "projectile" || result.motion_type === "free_fall" ? "✅ WILL RENDER BALL" : "❌ NO BALL"}`);
  console.log(`Has velocity for drawing:     ${velocity > 0 ? "✅ YES" : "❌ NO"}`);
  console.log(`Position calculation valid:   ${vx !== 0 && gravity > 0 ? "✅ YES" : "❌ NO"}`);
  
  console.log("\n" + "=".repeat(70));
  if (allPassed && velocity > 0 && height > 0) {
    console.log("✅ ALL VERIFICATIONS PASSED - BALL SIMULATION READY");
  } else {
    console.log("⚠️  SOME PARAMETERS MISSING - BALL MAY NOT RENDER CORRECTLY");
  }
  console.log("=".repeat(70) + "\n");
  
} catch (error) {
  console.log("❌ Test failed:", error.message);
}
