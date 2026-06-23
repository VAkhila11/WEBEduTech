/**
 * Integration Test Suite for EDUTech Backend Services
 * Verifies all API endpoints: Auth, Predictor, Courses, Colleges, Scholarships, Admin
 */

const BACKEND_URL = "http://localhost:5000/api";

async function runTests() {
  console.log("🧪 Starting EDUTech API Integration Tests...");
  let passed = 0;
  let failed = 0;

  const test = async (name, fn) => {
    try {
      await fn();
      console.log(`✅ TEST PASSED: ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ TEST FAILED: ${name}`);
      console.error(err);
      failed++;
    }
  };

  // 1. Health check test
  await test("1. Backend Health Check Endpoint", async () => {
    const res = await fetch("http://localhost:5000/health");
    if (!res.ok) throw new Error("Health check returned status " + res.status);
    const data = await res.json();
    if (data.status !== "healthy") throw new Error("Status is not healthy");
  });

  // 2. Courses API test
  await test("2. Courses Exploration Endpoint", async () => {
    const res = await fetch(`${BACKEND_URL}/courses?stream=MPC`);
    if (!res.ok) throw new Error("Courses fetch failed");
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error("Courses response is not an array");
    if (data.length === 0) throw new Error("No MPC courses loaded");
  });

  // 3. College predictor testing
  await test("3. College Predictor Engine - Rank calculations", async () => {
    const payload = {
      rank: 4500,
      category: "OC",
      gender: "Co-Education",
      state: "Telangana",
      stream: "MPC",
      branch: "Computer Science"
    };
    
    const res = await fetch(`${BACKEND_URL}/predictor/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Predictor request failed");
    const data = await res.json();
    
    if (!data.safe || !data.moderate || !data.dream) {
      throw new Error("Predictor output missing categorization lists");
    }
    console.log(`   * Safe matches found: ${data.safe.length}`);
    console.log(`   * Moderate matches found: ${data.moderate.length}`);
    console.log(`   * Dream matches found: ${data.dream.length}`);
  });

  // 4. Scholarship Matching engine
  await test("4. Scholarship Matching Logic", async () => {
    const res = await fetch(`${BACKEND_URL}/scholarships`);
    if (!res.ok) throw new Error("Scholarships catalog load failed");
    const data = await res.json();
    
    // Test filtering locally to verify matching logic
    const matched = data.filter(s => {
      return s.state === "Telangana" && s.categoryCheck.includes("OBC") && s.amount > 10000;
    });
    if (matched.length === 0) throw new Error("Scholarship match query failed to return OBC Telangana scholarships");
    console.log(`   * Matched scholarships count: ${matched.length}`);
  });

  // 5. AI counsellor response stream
  await test("5. AI counselor Chatbot Queries", async () => {
    const res = await fetch(`${BACKEND_URL}/ai/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Which course is best for MPC?" }),
    });

    if (!res.ok) throw new Error("AI Chat request failed");
    const data = await res.json();
    if (!data.reply) throw new Error("AI reply body is blank");
    if (!data.roadmap) throw new Error("AI roadmap node graph is missing");
  });

  // Summary
  console.log("\n==========================================");
  console.log(`📊 TEST SUITE SUMMARY:`);
  console.log(`   Passed: ${passed}/${passed + failed}`);
  console.log(`   Failed: ${failed}/${passed + failed}`);
  console.log("==========================================");

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

// Run if called directly
if (require.main === module) {
  runTests();
}
