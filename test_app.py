"""
Test suite verifying the Job Match & Readiness Predictor logic.
"""

def evaluate(degree, job, exp, user_skills):
    # Skill score (65%)
    total_w = sum(s["weight"] for s in job["coreSkills"])
    earned_w = 0
    missing_skills = []
    acquired_skills = []
    total_gap = 0

    for s in job["coreSkills"]:
        user_lvl = user_skills.get(s["name"], 0)
        req_lvl = s["requiredLevel"]
        w = s["weight"]
        if user_lvl >= req_lvl:
            bonus = 0.05 if user_lvl > req_lvl else 0
            earned_w += (1.0 + bonus) * w
            acquired_skills.append((s["name"], user_lvl, req_lvl))
        else:
            ratio = user_lvl / req_lvl
            earned_w += ratio * w
            gap = req_lvl - user_lvl
            total_gap += gap
            missing_skills.append((s["name"], user_lvl, req_lvl, gap))

    skill_score = min(100, max(0, (earned_w / total_w) * 100))

    # Experience score (25%)
    req_exp = job["requiredExperience"]
    if exp >= req_exp:
        exp_score = 100
    else:
        exp_score = min(100, max(30, (exp / req_exp) * 70 + 30))

    # Education score (10%)
    edu_scores = {"high-school": 65, "bachelor": 90, "master": 98, "phd": 100}
    edu_score = edu_scores.get(degree, 85)

    overall = round(0.65 * skill_score + 0.25 * exp_score + 0.10 * edu_score)
    overall = max(10, min(100, overall))

    # Status Message
    if overall >= 80:
        msg = "Excellent Match — You are highly qualified for this job."
        weeks = 0
    elif overall >= 70:
        msg = "You are close to being qualified for this job."
        weeks = max(2, min(4, round(total_gap * 1.2)))
    else:
        msg = "Unfortunately, you are not currently qualified for this job. Explore similar jobs that match your skills."
        weeks = max(5, min(12, round(total_gap * 1.5) + (2 if exp < req_exp else 0)))

    show_skill_dev = (overall < 70)

    return {
        "overall": overall,
        "skill_score": round(skill_score),
        "exp_score": round(exp_score),
        "edu_score": edu_score,
        "msg": msg,
        "weeks": weeks,
        "show_skill_dev": show_skill_dev,
        "acquired_count": len(acquired_skills),
        "missing_count": len(missing_skills)
    }

# Mock Job
ml_job = {
    "requiredExperience": 3.0,
    "coreSkills": [
        {"name": "Python", "requiredLevel": 4, "weight": 1.2},
        {"name": "PyTorch / TensorFlow", "requiredLevel": 4, "weight": 1.3},
        {"name": "Machine Learning Algorithms", "requiredLevel": 4, "weight": 1.2},
        {"name": "MLOps & Docker", "requiredLevel": 3, "weight": 1.0},
        {"name": "SQL & Data Modeling", "requiredLevel": 3, "weight": 0.9},
        {"name": "Cloud Platforms (AWS/GCP)", "requiredLevel": 3, "weight": 0.9}
    ]
}

def test_senior():
    res = evaluate(
        "master",
        ml_job,
        4.0,
        {
            "Python": 5,
            "PyTorch / TensorFlow": 4,
            "Machine Learning Algorithms": 4,
            "MLOps & Docker": 3,
            "SQL & Data Modeling": 4,
            "Cloud Platforms (AWS/GCP)": 3
        }
    )
    assert res["overall"] >= 80, f"Expected >= 80, got {res['overall']}"
    assert res["msg"] == "Excellent Match — You are highly qualified for this job."
    assert res["show_skill_dev"] is False
    print("[PASS] Senior Specialist Test:", res)

def test_transitioning():
    res = evaluate(
        "bachelor",
        ml_job,
        2.0,
        {
            "Python": 4,
            "PyTorch / TensorFlow": 2,
            "Machine Learning Algorithms": 3,
            "MLOps & Docker": 2,
            "SQL & Data Modeling": 3,
            "Cloud Platforms (AWS/GCP)": 2
        }
    )
    assert 70 <= res["overall"] < 80, f"Expected 70-79, got {res['overall']}"
    assert res["msg"] == "You are close to being qualified for this job."
    assert res["show_skill_dev"] is False
    print("[PASS] Transitioning Developer Test:", res)

def test_junior():
    res = evaluate(
        "bachelor",
        ml_job,
        0.5,
        {
            "Python": 2,
            "PyTorch / TensorFlow": 1,
            "Machine Learning Algorithms": 1,
            "MLOps & Docker": 0,
            "SQL & Data Modeling": 2,
            "Cloud Platforms (AWS/GCP)": 0
        }
    )
    assert res["overall"] < 70, f"Expected < 70, got {res['overall']}"
    assert res["msg"] == "Unfortunately, you are not currently qualified for this job. Explore similar jobs that match your skills."
    assert res["show_skill_dev"] is True
    assert res["weeks"] >= 5
    print("[PASS] Junior Switcher Test:", res)

if __name__ == "__main__":
    test_senior()
    test_transitioning()
    test_junior()
    print("\n[SUCCESS] ALL LOGIC AND THRESHOLD TESTS PASSED PERFECTLY!")

