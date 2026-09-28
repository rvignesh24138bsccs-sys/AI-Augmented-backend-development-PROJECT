import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

DOWNLOADS_DIR = r"C:\Users\WIN\Downloads\Brainstorming & Ideation Phase-20260923T070439Z-1-001\Brainstorming & Ideation Phase"
WORKSPACE_DIR = r"c:\fit track\Brainstorming & Ideation Phase"
os.makedirs(DOWNLOADS_DIR, exist_ok=True)
os.makedirs(WORKSPACE_DIR, exist_ok=True)

# Styling Constants
COLOR_PRIMARY = RGBColor(30, 58, 138)      # #1E3A8A Deep Navy
COLOR_SECONDARY = RGBColor(13, 148, 136)   # #0D9488 Teal
COLOR_DARK = RGBColor(31, 41, 55)          # #1F2937 Slate
COLOR_MUTED = RGBColor(107, 114, 128)      # #6B7280 Gray
COLOR_ACCENT = RGBColor(79, 70, 229)       # #4F46E5 Indigo

HEX_PRIMARY_BG = "1E3A8A"
HEX_HEADER_BG = "F1F5F9"                   # Light Slate
HEX_ALT_ROW_BG = "F8FAFC"
HEX_CARD_BG = "F0FDF4"                     # Light Mint
HEX_PAIN_BG = "FEF2F2"                     # Light Red
HEX_BORDER = "CBD5E1"

def set_cell_background(cell, hex_color):
    tc_pr = cell._element.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    tc_pr.append(shd)

def set_cell_margins(cell, top=80, bottom=80, left=100, right=100):
    tc_pr = cell._element.get_or_add_tcPr()
    tcMar = parse_xml(f'''
        <w:tcMar {nsdecls("w")}>
            <w:top w:w="{top}" w:type="dxa"/>
            <w:bottom w:w="{bottom}" w:type="dxa"/>
            <w:left w:w="{left}" w:type="dxa"/>
            <w:right w:w="{right}" w:type="dxa"/>
        </w:tcMar>
    ''')
    tc_pr.append(tcMar)

def set_cell_borders(cell, top="single", bottom="single", left="single", right="single", color=HEX_BORDER, sz="4"):
    tc_pr = cell._element.get_or_add_tcPr()
    borders = parse_xml(f'''
        <w:tcBorders {nsdecls("w")}>
            <w:top w:val="{top}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:left w:val="{left}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:bottom w:val="{bottom}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:right w:val="{right}" w:sz="{sz}" w:space="0" w:color="{color}"/>
        </w:tcBorders>
    ''')
    tc_pr.append(borders)

def safe_save(doc, path):
    try:
        doc.save(path)
        print(f"Successfully saved: {path}")
    except PermissionError:
        print(f"Notice: '{path}' is currently open in Word/another program. Saving copy...")
        base, ext = os.path.splitext(path)
        alt_path = f"{base}_Updated{ext}"
        try:
            doc.save(alt_path)
            print(f"Saved update to: {alt_path}")
        except Exception as e:
            print(f"Could not save {alt_path}: {e}")
def init_clean_document():
    doc = Document()
    for sec in doc.sections:
        sec.top_margin = Inches(0.7)
        sec.bottom_margin = Inches(0.7)
        sec.left_margin = Inches(0.7)
        sec.right_margin = Inches(0.7)
    return doc

def add_meta_header(doc, title_text, subtitle_text, max_marks="4 Marks"):
    p_title = doc.add_paragraph()
    p_title.paragraph_format.space_before = Pt(0)
    p_title.paragraph_format.space_after = Pt(1)
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_t = p_title.add_run(title_text)
    r_t.bold = True
    r_t.font.name = "Calibri"
    r_t.font.size = Pt(16)
    r_t.font.color.rgb = COLOR_PRIMARY

    p_sub = doc.add_paragraph()
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(6)
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_sub = p_sub.add_run(subtitle_text)
    r_sub.font.name = "Calibri"
    r_sub.font.size = Pt(10)
    r_sub.font.color.rgb = COLOR_SECONDARY

    tbl = doc.add_table(rows=4, cols=2)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_info = [
        ("Date", "31 January 2025"),
        ("Team ID", "FIT-AI-2025"),
        ("Project Name", "FitTrack AI - Personalized Fitness Tracking System"),
        ("Maximum Marks", max_marks)
    ]
    for i, (k, v) in enumerate(meta_info):
        row = tbl.rows[i]
        c0, c1 = row.cells[0], row.cells[1]
        
        p0 = c0.paragraphs[0]
        p0.paragraph_format.space_before = Pt(1)
        p0.paragraph_format.space_after = Pt(1)
        r0 = p0.add_run(k)
        r0.bold = True
        r0.font.size = Pt(9)
        r0.font.color.rgb = COLOR_DARK
        
        p1 = c1.paragraphs[0]
        p1.paragraph_format.space_before = Pt(1)
        p1.paragraph_format.space_after = Pt(1)
        r1 = p1.add_run(v)
        r1.font.size = Pt(9)
        if k == "Project Name":
            r1.bold = True
            r1.font.color.rgb = COLOR_PRIMARY
        elif k == "Maximum Marks":
            r1.bold = True
            r1.font.color.rgb = COLOR_SECONDARY
        else:
            r1.font.color.rgb = COLOR_DARK
            
        set_cell_background(c0, HEX_HEADER_BG)
        set_cell_background(c1, "FFFFFF")
        set_cell_margins(c0, 40, 40, 80, 80)
        set_cell_margins(c1, 40, 40, 80, 80)
        set_cell_borders(c0, color=HEX_BORDER)
        set_cell_borders(c1, color=HEX_BORDER)
        c0.width = Inches(1.6)
        c1.width = Inches(5.5)

def add_heading(doc, text, level=1):
    h = doc.add_heading(text, level=level)
    h.paragraph_format.space_before = Pt(8 if level==1 else 6)
    h.paragraph_format.space_after = Pt(2)
    for r in h.runs:
        r.font.name = "Calibri"
        if level == 1:
            r.font.size = Pt(12)
            r.font.color.rgb = COLOR_PRIMARY
        elif level == 2:
            r.font.size = Pt(10.5)
            r.font.color.rgb = COLOR_SECONDARY
        else:
            r.font.size = Pt(9.5)
            r.font.color.rgb = COLOR_DARK
    return h

def add_compact_paragraph(doc, text="", bold_prefix="", indent=0):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(1)
    p.paragraph_format.space_after = Pt(2)
    if indent > 0:
        p.paragraph_format.left_indent = Inches(indent)
    if bold_prefix:
        r_b = p.add_run(bold_prefix)
        r_b.bold = True
        r_b.font.size = Pt(9)
        r_b.font.color.rgb = COLOR_PRIMARY
    if text:
        r_t = p.add_run(text)
        r_t.font.size = Pt(9)
        r_t.font.color.rgb = COLOR_DARK
    return p

# ==============================================================================
# 1. DEFINE PROBLEM STATEMENTS DOCUMENT (COMPACT & CONTENT-RICH)
# ==============================================================================
def create_define_problem_statements_doc():
    doc = init_clean_document()
    add_meta_header(doc, "Ideation Phase: Define Problem Statements", "Customer Problem Statement Matrix & Root Cause Decomposition", "2 Marks")

    add_heading(doc, "1. Executive Context & Problem Statement Template Reference", level=1)
    add_compact_paragraph(doc, "A well-articulated customer problem statement allows the engineering and product team to address exact customer friction points. Using the standard design thinking formulation [I am | I'm trying to | But | Because | Which makes me feel], we mapped key customer profiles for FitTrack AI.")

    add_heading(doc, "2. Customer Problem Statement (PS) Matrix", level=1)
    tbl_ps = doc.add_table(rows=6, cols=6)
    tbl_ps.alignment = WD_TABLE_ALIGNMENT.CENTER
    headers = ["Problem Statement (PS)", "I am (Customer)", "I'm trying to", "But", "Because", "Which makes me feel"]
    
    hdr_row = tbl_ps.rows[0]
    for i, h in enumerate(headers):
        c = hdr_row.cells[i]
        c.text = ""
        p = c.paragraphs[0]
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(h)
        r.bold = True
        r.font.size = Pt(8.5)
        r.font.color.rgb = RGBColor(255, 255, 255)
        set_cell_background(c, HEX_PRIMARY_BG)
        set_cell_margins(c, 50, 50, 60, 60)
        set_cell_borders(c, color=HEX_BORDER)

    ps_matrix_data = [
        (
            "PS-1 (Primary)",
            "A 28-year-old software engineer & gym regular (Rahul)",
            "Maintain an organized, centralized record of daily workouts, sets, duration, and calories",
            "I frequently miss logging sessions and lose historical workout progression records",
            "Manual logging in spreadsheets or notebooks is tedious, time-consuming, and easily forgotten during workdays",
            "Frustrated, disorganized, and unable to measure long-term fitness consistency"
        ),
        (
            "PS-2",
            "A 24-year-old beginner seeking healthy weight loss (Priya)",
            "Follow a safe, structured weekly routine matched to my fitness level and schedule",
            "Generic online workout splits lead to excessive soreness, fatigue, and eventual workout abandonment",
            "Commercial fitness apps provide static templates and private personal trainers are cost-prohibitive",
            "Overwhelmed, intimidated, and doubtful whether my daily efforts will yield results"
        ),
        (
            "PS-3",
            "A 32-year-old marathon runner & cardio enthusiast (Amit)",
            "Analyze weekly workout volume trends (duration vs calories burned over time)",
            "I have no automated way to extract actionable trends or performance summaries from logged workouts",
            "Existing tools merely act as passive storage forms without intelligent analytical synthesis",
            "Stagnant, uninformed, and lacking motivation to push for new athletic benchmarks"
        ),
        (
            "PS-4",
            "A 30-year-old returning to exercise post-injury (Sarah)",
            "Exercise safely with appropriate volume scaling and adequate recovery intervals",
            "I risk overtraining or re-injury by guessing appropriate intensity without dynamic guidance",
            "Standard workout logs lack contextual injury prevention cues and adaptive recovery tips",
            "Anxious, cautious, and hesitant to commit to progressive overload routines"
        ),
        (
            "PS-5",
            "A privacy-conscious user managing personal health data (Vikram)",
            "Access workout records seamlessly across web and mobile devices without privacy leaks",
            "Commercial free trackers often monetize personal health data or lack tokenized API security",
            "Many lightweight trackers lack JWT token authorization, password hashing, and encrypted databases",
            "Distrustful, vulnerable, and reluctant to share personal biometric records"
        )
    ]

    col_w = [Inches(1.0), Inches(1.2), Inches(1.3), Inches(1.2), Inches(1.3), Inches(1.1)]
    for r_idx, row_vals in enumerate(ps_matrix_data):
        row = tbl_ps.rows[r_idx + 1]
        bg = HEX_ALT_ROW_BG if r_idx % 2 == 1 else "FFFFFF"
        for c_idx, val in enumerate(row_vals):
            cell = row.cells[c_idx]
            cell.text = ""
            p = cell.paragraphs[0]
            p.paragraph_format.space_before = Pt(2)
            p.paragraph_format.space_after = Pt(2)
            r = p.add_run(val)
            r.font.size = Pt(8)
            r.font.color.rgb = COLOR_DARK
            if c_idx == 0:
                r.bold = True
                r.font.color.rgb = COLOR_PRIMARY
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            set_cell_background(cell, bg)
            set_cell_margins(cell, 40, 40, 50, 50)
            set_cell_borders(cell, color=HEX_BORDER)
            cell.width = col_w[c_idx]

    add_heading(doc, "3. Problem Decomposition: 5-Whys Root Cause Analysis", level=1)
    whys = [
        ("Why 1: Why do users abandon workout tracking?", "Manual logging in notebooks or generic spreadsheets is repetitive, slow, and provides no immediate guidance."),
        ("Why 2: Why is manual logging slow and unrewarding?", "Users have to manually remember exercises, estimate calories burned, and track split schedules without real-time assistance."),
        ("Why 3: Why is there no real-time assistance?", "Traditional applications act as passive storage forms rather than active, intelligent coaching systems."),
        ("Why 4: Why are existing systems passive?", "They lack integrated Generative AI engines capable of synthesizing user demographics, history, and goals on demand."),
        ("Why 5 (Root Cause):", "The absence of a centralized, secure REST API platform that couples frictionless CRUD workout tracking with automated Google Gemini AI recommendations and insights.")
    ]
    for q, a in whys:
        add_compact_paragraph(doc, a, bold_prefix=q + " ", indent=0.15)

    add_heading(doc, "4. Point-of-View (POV) & How Might We (HMW) Opportunity Spaces", level=1)
    add_compact_paragraph(doc, "Rahul (a busy working professional) needs a frictionless workout tracker and dynamic AI coaching engine because manual logging causes inconsistency, generic workout plans lead to plateaus, and human trainers are cost-prohibitive.", bold_prefix="Core POV: ", indent=0.15)
    
    hmws = [
        ("HMW-1 (Frictionless Logging):", "How might we make logging a complete workout session take less than 30 seconds?"),
        ("HMW-2 (AI Recommendation):", "How might we generate personalized weekly workout plans dynamically using Google Gemini AI based on age, goals, and experience?"),
        ("HMW-3 (Performance Insights):", "How might we automatically synthesize raw workout metrics (duration, frequency, calories) into actionable coaching insights?"),
        ("HMW-4 (Security & Privacy):", "How might we enforce zero-trust tokenized JWT security and database encryption across all user records?")
    ]
    for h_lbl, h_val in hmws:
        add_compact_paragraph(doc, h_val, bold_prefix=h_lbl + " ", indent=0.15)

    out_downloads = os.path.join(DOWNLOADS_DIR, "Define Problem Statements Template.docx")
    out_workspace = os.path.join(WORKSPACE_DIR, "Define Problem Statements Template.docx")
    safe_save(doc, out_downloads)
    safe_save(doc, out_workspace)
    print("Regenerated Define Problem Statements Template.docx cleanly!")

# ==============================================================================
# 2. EMPATHY MAP CANVAS DOCUMENT (COMPACT & CONTENT-RICH)
# ==============================================================================
def create_empathy_map_doc():
    doc = init_clean_document()
    add_meta_header(doc, "Ideation Phase: Empathize & Discover", "Comprehensive Empathy Map Canvas & User Persona Mapping", "4 Marks")

    add_heading(doc, "1. Target User Persona Profile", level=1)
    tbl_p = doc.add_table(rows=4, cols=2)
    tbl_p.alignment = WD_TABLE_ALIGNMENT.CENTER
    persona_data = [
        ("Primary Persona", "Rahul Sharma | Age: 28 | Occupation: Software Engineer & Gym Regular | Fitness Goal: Muscle Gain & Stamina"),
        ("Secondary Persona", "Priya Patel | Age: 24 | Occupation: Marketing Analyst & Fitness Beginner | Fitness Goal: Safe Weight Loss"),
        ("Core Frustrations", "Tedious manual logging, fragmented history, conflicting influencer routines, expensive personal trainers."),
        ("Solution Expectation", "Fast cloud logging (<30s), custom Google Gemini AI weekly routines, and automated weekly progress insights.")
    ]
    for i, (k, v) in enumerate(persona_data):
        row = tbl_p.rows[i]
        c0, c1 = row.cells[0], row.cells[1]
        
        p0 = c0.paragraphs[0]
        p0.paragraph_format.space_before = Pt(1)
        p0.paragraph_format.space_after = Pt(1)
        r0 = p0.add_run(k)
        r0.bold = True
        r0.font.size = Pt(8.5)
        r0.font.color.rgb = COLOR_DARK
        
        p1 = c1.paragraphs[0]
        p1.paragraph_format.space_before = Pt(1)
        p1.paragraph_format.space_after = Pt(1)
        r1 = p1.add_run(v)
        r1.font.size = Pt(8.5)
        r1.font.color.rgb = COLOR_PRIMARY if i < 2 else COLOR_DARK
        
        set_cell_background(c0, HEX_HEADER_BG)
        set_cell_background(c1, "FFFFFF")
        set_cell_margins(c0, 40, 40, 60, 60)
        set_cell_margins(c1, 40, 40, 60, 60)
        set_cell_borders(c0, color=HEX_BORDER)
        set_cell_borders(c1, color=HEX_BORDER)
        c0.width = Inches(1.8)
        c1.width = Inches(5.3)

    add_heading(doc, "2. 7-Quadrant Empathy Map Canvas Breakdown", level=1)
    tbl_emp = doc.add_table(rows=7, cols=2)
    tbl_emp.alignment = WD_TABLE_ALIGNMENT.CENTER
    
    quadrants = [
        (
            "1. WHO are we empathizing with?",
            "• Primary User: Rahul Sharma (28), full-stack engineer working 45+ hrs/week while training 4-5 days/week.\n"
            "• Secondary User: Priya Patel (24), beginner who desires structured fitness without intimidation or plateau.\n"
            "• Shared Context: Busy urban professionals needing time-efficient, data-driven, and science-backed fitness routines."
        ),
        (
            "2. What do they need to DO?",
            "• Log workouts (name, category, duration, calories burned, date) in under 30 seconds.\n"
            "• Search and retrieve past workouts by title, category (Cardio, Strength, HIIT, Flexibility), or date.\n"
            "• Request tailored Google Gemini AI weekly workout routines based on age, goals, and experience.\n"
            "• Access automated AI performance insights and progress summaries from cumulative workout metrics."
        ),
        (
            "3. What do they SEE?",
            "• Social media influencers promoting contradictory, unvetted workout routines and extreme fad diets.\n"
            "• Bloated commercial fitness apps that lock basic features behind expensive paywalls.\n"
            "• Fragmented paper notebooks, notes app drafts, and smartwatch dashboards that fail to connect."
        ),
        (
            "4. What do they SAY?",
            "• 'I wish an app could just build my workout plan based on my exact goals and schedule.'\n"
            "• 'I constantly forget what exercises and weights I did last week.'\n"
            "• 'Personal gym trainers charge high recurring fees that I cannot justify long-term.'"
        ),
        (
            "5. What do they DO?",
            "• Skips workout logging on busy workdays, causing incomplete historical progress logs.\n"
            "• Mentally estimates calories burned and workout durations rather than tracking accurately.\n"
            "• Follows generic online workout splits and quits after 3-4 weeks due to lack of personalization and fatigue."
        ),
        (
            "6. What do they HEAR?",
            "• Gym friends debating competing workout splits (Push-Pull-Legs vs Bro-Splits vs Full Body).\n"
            "• Gym trainers pitching high-cost personal training packages.\n"
            "• Fitness podcasts emphasizing progressive overload, calorie deficit management, and recovery tracking."
        ),
        (
            "7. What do they THINK & FEEL?\n(Pains vs. Gains)",
            "PAINS:\n"
            "• High friction in manual data entry leading to logging fatigue and drop-off.\n"
            "• Fear of plateau, training fatigue, or acute injuries from improper workout selection.\n"
            "• Lack of centralized search to review historical workout records.\n\n"
            "GAINS:\n"
            "• Frictionless workout logging with instant cloud storage and retrieval.\n"
            "• Hyper-personalized Google Gemini AI workout routines matched to individual goals.\n"
            "• Automated weekly performance summaries, motivational feedback, and measurable progress."
        )
    ]

    for i, (q_t, q_d) in enumerate(quadrants):
        row = tbl_emp.rows[i]
        c0, c1 = row.cells[0], row.cells[1]
        
        p0 = c0.paragraphs[0]
        p0.paragraph_format.space_before = Pt(2)
        p0.paragraph_format.space_after = Pt(2)
        r0 = p0.add_run(q_t)
        r0.bold = True
        r0.font.size = Pt(8.5)
        r0.font.color.rgb = COLOR_PRIMARY
        
        p1 = c1.paragraphs[0]
        p1.paragraph_format.space_before = Pt(2)
        p1.paragraph_format.space_after = Pt(2)
        r1 = p1.add_run(q_d)
        r1.font.size = Pt(8)
        r1.font.color.rgb = COLOR_DARK
        
        bg = HEX_CARD_BG if i == 6 else (HEX_HEADER_BG if i % 2 == 0 else "FFFFFF")
        set_cell_background(c0, HEX_HEADER_BG)
        set_cell_background(c1, bg)
        set_cell_margins(c0, 40, 40, 60, 60)
        set_cell_margins(c1, 40, 40, 60, 60)
        set_cell_borders(c0, color=HEX_BORDER)
        set_cell_borders(c1, color=HEX_BORDER)
        c0.width = Inches(1.8)
        c1.width = Inches(5.3)

    add_heading(doc, "3. User Journey & Emotional Curve", level=1)
    add_compact_paragraph(doc, "Rahul arrives at gym feeling hurried. FitTrack AI eliminates guesswork with instant plan review.", bold_prefix="• Pre-Workout (Motivation + Clarity): ", indent=0.15)
    add_compact_paragraph(doc, "Logs sets and duration in <30 seconds via mobile/API interface without interrupting rest intervals.", bold_prefix="• During Workout (Frictionless Logging): ", indent=0.15)
    add_compact_paragraph(doc, "Reviews logged metrics; Gemini AI aggregates total calories and session duration with positive feedback.", bold_prefix="• Post-Workout (Accomplishment & Insight): ", indent=0.15)
    add_compact_paragraph(doc, "Receives AI weekly synthesis highlighting consistency improvements and suggested recovery days.", bold_prefix="• Weekly Synthesis (Progress Confirmation): ", indent=0.15)

    out_downloads = os.path.join(DOWNLOADS_DIR, "Empathy Map Canvas.docx")
    out_workspace = os.path.join(WORKSPACE_DIR, "Empathy Map Canvas.docx")
    safe_save(doc, out_downloads)
    safe_save(doc, out_workspace)
    print("Regenerated Empathy Map Canvas.docx cleanly!")

# ==============================================================================
# 3. BRAINSTORMING & IDEA PRIORITIZATION DOCUMENT (COMPACT & CONTENT-RICH)
# ==============================================================================
def create_brainstorming_doc():
    doc = init_clean_document()
    add_meta_header(doc, "Ideation Phase: Brainstorming & Idea Prioritization", "Idea Generation, Affinity Clustering & MoSCoW Prioritization", "4 Marks")

    add_heading(doc, "Step 1: Team Collaboration & Problem Statement Selection", level=1)
    add_compact_paragraph(doc, "During the collaborative ideation session, the team applied design thinking brainstorming principles: encouraging volume, deferring early criticism, and building upon peer concepts. From candidate challenges, we selected our guiding problem statement:")
    add_compact_paragraph(doc, "\"How can we build a secure, lightweight REST backend that eliminates the manual friction of workout tracking and leverages Google Gemini Generative AI to provide real-time personalized workout plans and performance insights?\"", bold_prefix="Selected Core Challenge: ", indent=0.15)

    add_heading(doc, "Step 2: Brainstorm, Idea Listing & Affinity Grouping (25 Ideas)", level=1)
    tbl_cl = doc.add_table(rows=5, cols=2)
    tbl_cl.alignment = WD_TABLE_ALIGNMENT.CENTER
    
    cluster_info = [
        (
            "Cluster A: Core Workout Lifecycle Management",
            "1. REST endpoint to create workout records (POST /api/workouts)\n"
            "2. Multi-parameter search by workout name, category, and date (GET /api/workouts/search)\n"
            "3. Full CRUD update and delete capabilities with Mongoose validation\n"
            "4. Sorted chronological history feed with pagination support (GET /api/workouts)\n"
            "5. Workout categorization taxonomy (Strength, Cardio, HIIT, Flexibility, Recovery)"
        ),
        (
            "Cluster B: Google Gemini AI Intelligence",
            "6. Dynamic weekly workout plan generator based on age, goals, and level (POST /api/ai/recommendation)\n"
            "7. Performance insights engine analyzing total duration and calories (GET /api/ai/insights)\n"
            "8. Context-aware injury prevention tips and warm-up/cool-down recommendations\n"
            "9. Dynamic workout intensity scaling based on user feedback\n"
            "10. Natural language conversational fitness coaching assistant"
        ),
        (
            "Cluster C: Analytics & Metrics Engine",
            "11. Automated total workout sessions, duration, and calorie burn aggregator\n"
            "12. Target calorie burn estimator based on exercise category and duration\n"
            "13. Weekly workout consistency adherence score\n"
            "14. Visual category distribution breakdown (Cardio vs Strength ratio)\n"
            "15. Month-over-month workout volume comparative analytics"
        ),
        (
            "Cluster D: Gamification & Engagement",
            "16. Daily and weekly workout streak counter\n"
            "17. Milestone achievement badges (10th, 50th, 100th workout completed)\n"
            "18. Uplifting AI motivational quotes accompanying insight summaries\n"
            "19. Shareable workout accomplishment cards for social media\n"
            "20. Community workout challenge leaderboard"
        ),
        (
            "Cluster E: Architecture, Security & Reliability",
            "21. JWT stateless token-based authorization shield with bearer tokens\n"
            "22. Secure password hashing using bcrypt.js before MongoDB persistence\n"
            "23. Centralized error handling middleware preventing server crashes & leakages\n"
            "24. Modular Model-View-Controller (MVC) separation of concerns\n"
            "25. Mongoose compound indexing on user, date, and category fields"
        )
    ]

    for i, (c_name, c_text) in enumerate(cluster_info):
        row = tbl_cl.rows[i]
        c0, c1 = row.cells[0], row.cells[1]
        
        p0 = c0.paragraphs[0]
        p0.paragraph_format.space_before = Pt(2)
        p0.paragraph_format.space_after = Pt(2)
        r0 = p0.add_run(c_name)
        r0.bold = True
        r0.font.size = Pt(8.5)
        r0.font.color.rgb = COLOR_PRIMARY
        
        p1 = c1.paragraphs[0]
        p1.paragraph_format.space_before = Pt(2)
        p1.paragraph_format.space_after = Pt(2)
        r1 = p1.add_run(c_text)
        r1.font.size = Pt(8)
        r1.font.color.rgb = COLOR_DARK
        
        set_cell_background(c0, HEX_HEADER_BG)
        set_cell_background(c1, "FFFFFF" if i % 2 == 0 else HEX_ALT_ROW_BG)
        set_cell_margins(c0, 40, 40, 60, 60)
        set_cell_margins(c1, 40, 40, 60, 60)
        set_cell_borders(c0, color=HEX_BORDER)
        set_cell_borders(c1, color=HEX_BORDER)
        c0.width = Inches(2.0)
        c1.width = Inches(5.1)

    add_heading(doc, "Step 3: Idea Prioritization (2x2 Matrix & MoSCoW Framework)", level=1)
    add_compact_paragraph(doc, "All 25 brainstormed ideas were prioritized using a 2x2 Impact vs. Feasibility Matrix and structured into the MoSCoW framework to define the MVP scope:")

    tbl_m = doc.add_table(rows=5, cols=3)
    tbl_m.alignment = WD_TABLE_ALIGNMENT.CENTER
    
    hdr = tbl_m.rows[0]
    for c_i, th in enumerate(["MoSCoW Category", "Selected Features / Ideas", "Strategic Rationale"]):
        c = hdr.cells[c_i]
        c.text = ""
        p = c.paragraphs[0]
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(th)
        r.bold = True
        r.font.size = Pt(8.5)
        r.font.color.rgb = RGBColor(255, 255, 255)
        set_cell_background(c, HEX_PRIMARY_BG)
        set_cell_margins(c, 50, 50, 60, 60)
        set_cell_borders(c, color=HEX_BORDER)

    moscow_data = [
        (
            "MUST HAVE\n(Core MVP Scope)",
            "• Secure JWT Authentication & Bcrypt Hashing (E1, E2)\n"
            "• Complete Workout CRUD Lifecycle Operations (A1, A3, A4, A5)\n"
            "• Multi-Field Workout Search by Name, Category, Date (A2)\n"
            "• Google Gemini AI Personalized Weekly Routine Generator (B1)\n"
            "• Google Gemini AI Fitness Insights & Stats Aggregator (B2, C1)\n"
            "• Centralized Error Middleware & MVC Layering (E3, E4, E5)",
            "Essential foundational capabilities required to deliver secure tracking and key AI differentiator for FitTrack AI."
        ),
        (
            "SHOULD HAVE\n(Next Release - v1.1)",
            "• Streak Counter & Motivational AI Prompts (D1, D3)\n"
            "• Visual Category Distribution Breakdown (C4)\n"
            "• Calorie Target Burn Estimator (C2)\n"
            "• Injury Prevention Tips Integration (B3)",
            "High-value enhancements that boost retention and enrich dashboard visualization without complicating core backend."
        ),
        (
            "COULD HAVE\n(Future Roadmap - v2.0)",
            "• Milestone Achievement Badges (D2)\n"
            "• Social Workout Exportable Cards (D4)\n"
            "• Conversational AI Fitness Chatbot (B5)\n"
            "• Month-over-Month Comparative Analytics (C5)",
            "Engaging secondary features deferred to post-launch feature releases."
        ),
        (
            "WON'T HAVE\n(Out of Initial Scope)",
            "• Real-Time BLE Smartwatch Hardware Sensor Sync\n"
            "• Global Competitive Multi-User Leaderboards (D5)\n"
            "• Live Streaming Video Gym Classes",
            "Requires custom hardware SDK bridges and multi-tenant matchmaking, outside current standalone API focus."
        )
    ]

    col_w_m = [Inches(1.5), Inches(3.4), Inches(2.2)]
    for r_i, (cat, feats, rat) in enumerate(moscow_data):
        row = tbl_m.rows[r_i + 1]
        bg = HEX_CARD_BG if "MUST" in cat else ("FFFFFF" if r_i % 2 == 0 else HEX_ALT_ROW_BG)
        for c_i, val in enumerate([cat, feats, rat]):
            c = row.cells[c_i]
            c.text = ""
            p = c.paragraphs[0]
            p.paragraph_format.space_before = Pt(2)
            p.paragraph_format.space_after = Pt(2)
            r = p.add_run(val)
            r.font.size = Pt(8)
            r.font.color.rgb = COLOR_DARK
            if c_i == 0:
                r.bold = True
                if "MUST" in val:
                    r.font.color.rgb = COLOR_PRIMARY
                elif "SHOULD" in val:
                    r.font.color.rgb = COLOR_SECONDARY
                else:
                    r.font.color.rgb = COLOR_MUTED
            set_cell_background(c, bg)
            set_cell_margins(c, 40, 40, 50, 50)
            set_cell_borders(c, color=HEX_BORDER)
            c.width = col_w_m[c_i]

    out_downloads = os.path.join(DOWNLOADS_DIR, "Brainstorming- Idea Generation- Prioritizaation Template.docx")
    out_workspace = os.path.join(WORKSPACE_DIR, "Brainstorming- Idea Generation- Prioritizaation Template.docx")
    safe_save(doc, out_downloads)
    safe_save(doc, out_workspace)
    print("Regenerated Brainstorming- Idea Generation- Prioritizaation Template.docx cleanly!")

# ==============================================================================
# 4. MASTER CONSOLIDATED PROJECT DOCUMENT (COMPACT & CONTENT-RICH)
# ==============================================================================
def create_master_report_doc():
    doc = init_clean_document()
    add_meta_header(doc, "FitTrack AI - Brainstorming & Ideation Report", "Design Thinking Deliverable: Empathy Mapping, Problem Definition & Prioritization", "10 Marks Total")

    add_heading(doc, "1. Executive Summary & Problem Context", level=1)
    add_compact_paragraph(doc, "FitTrack AI is an intelligent fitness tracking RESTful platform developed to eliminate the friction of manual exercise logging and deliver automated, personalized fitness coaching. Traditional fitness tracking suffers from severe drop-off rates because manual logging is tedious, generic online workout plans cause plateaus or injury, and commercial apps lack intelligent synthesis. By integrating Node.js, Express.js, MongoDB, and Google Gemini AI, FitTrack AI transforms raw workout data into tailored weekly routines and actionable performance insights.")

    add_heading(doc, "2. Empathize & Discover: Empathy Map Canvas", level=1)
    add_compact_paragraph(doc, "Empathy research grounded the product architecture in the daily realities of Rahul Sharma (28, Software Engineer & Gym Regular) and Priya Patel (24, Beginner Fitness Seeker):")
    
    tbl_emp = doc.add_table(rows=7, cols=2)
    tbl_emp.alignment = WD_TABLE_ALIGNMENT.CENTER
    quads = [
        ("1. WHO are we empathizing with?", "Rahul Sharma (28), a busy professional balancing tight work schedules with regular gym training."),
        ("2. What do they need to DO?", "Log exercises in <30s, search history, obtain tailored Gemini AI weekly plans, and review weekly insights."),
        ("3. What do they SEE?", "Conflicting influencer advice, bloated paid apps, and damaged or lost paper workout notebooks."),
        ("4. What do they SAY?", "'I need a customized plan for my level', 'I keep forgetting my past weights', 'Trainers are too pricey'."),
        ("5. What do they DO?", "Skips logging on busy days, estimates calories in head, and abandons generic splits after a few weeks."),
        ("6. What do they HEAR?", "Gym peers debating splits, fitness podcasts promoting progressive overload, and trainers pitching expensive plans."),
        ("7. What do they THINK & FEEL?", "PAINS: Tedious manual entry, risk of injury/plateau, scattered logs.\nGAINS: Zero-friction logging, Gemini AI tailored plans, automated weekly insights.")
    ]
    for idx, (t, c_txt) in enumerate(quads):
        row = tbl_emp.rows[idx]
        c0, c1 = row.cells[0], row.cells[1]
        
        p0 = c0.paragraphs[0]
        p0.paragraph_format.space_before = Pt(1)
        p0.paragraph_format.space_after = Pt(1)
        r0 = p0.add_run(t)
        r0.bold = True
        r0.font.size = Pt(8.5)
        r0.font.color.rgb = COLOR_PRIMARY
        
        p1 = c1.paragraphs[0]
        p1.paragraph_format.space_before = Pt(1)
        p1.paragraph_format.space_after = Pt(1)
        r1 = p1.add_run(c_txt)
        r1.font.size = Pt(8)
        r1.font.color.rgb = COLOR_DARK
        
        bg = HEX_CARD_BG if idx == 6 else (HEX_HEADER_BG if idx % 2 == 0 else "FFFFFF")
        set_cell_background(c0, HEX_HEADER_BG)
        set_cell_background(c1, bg)
        set_cell_margins(c0, 40, 40, 50, 50)
        set_cell_margins(c1, 40, 40, 50, 50)
        set_cell_borders(c0, color=HEX_BORDER)
        set_cell_borders(c1, color=HEX_BORDER)
        c0.width = Inches(1.8)
        c1.width = Inches(5.3)

    add_heading(doc, "3. Define: Customer Problem Statements & Root Cause Analysis", level=1)
    tbl_ps = doc.add_table(rows=6, cols=6)
    tbl_ps.alignment = WD_TABLE_ALIGNMENT.CENTER
    ps_hdrs = ["PS ID", "I am (Customer)", "I'm trying to", "But", "Because", "Which makes me feel"]
    for c_i, th in enumerate(ps_hdrs):
        c = tbl_ps.rows[0].cells[c_i]
        c.text = ""
        p = c.paragraphs[0]
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(th)
        r.bold = True
        r.font.size = Pt(8.5)
        r.font.color.rgb = RGBColor(255, 255, 255)
        set_cell_background(c, HEX_PRIMARY_BG)
        set_cell_margins(c, 50, 50, 50, 50)
        set_cell_borders(c, color=HEX_BORDER)

    ps_data_master = [
        ("PS-1", "Rahul (Busy Regular)", "Centralize daily workout records", "I miss logging sessions", "Manual note-taking is tedious & forgotten", "Frustrated & disorganized"),
        ("PS-2", "Priya (Beginner)", "Follow tailored routines", "Generic splits cause fatigue", "Static apps lack personalization", "Overwhelmed & intimidated"),
        ("PS-3", "Amit (Runner)", "Analyze weekly trends", "Cannot extract patterns", "Apps store raw data without AI synthesis", "Stagnant & demotivated"),
        ("PS-4", "Sarah (Post-Injury)", "Exercise with safe recovery", "Risk overtraining", "Logs lack dynamic safety & form cues", "Anxious & cautious"),
        ("PS-5", "Vikram (Privacy User)", "Secure multi-device sync", "Free apps leak data", "Trackers lack tokenized JWT authentication", "Distrustful & vulnerable")
    ]
    col_w_ps = [Inches(0.8), Inches(1.1), Inches(1.3), Inches(1.2), Inches(1.4), Inches(1.3)]
    for r_i, rdata in enumerate(ps_data_master):
        row = tbl_ps.rows[r_i + 1]
        bg = HEX_ALT_ROW_BG if r_i % 2 == 1 else "FFFFFF"
        for c_i, val in enumerate(rdata):
            c = row.cells[c_i]
            c.text = ""
            p = c.paragraphs[0]
            p.paragraph_format.space_before = Pt(2)
            p.paragraph_format.space_after = Pt(2)
            r = p.add_run(val)
            r.font.size = Pt(8)
            r.font.color.rgb = COLOR_DARK
            if c_i == 0:
                r.bold = True
                r.font.color.rgb = COLOR_PRIMARY
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            set_cell_background(c, bg)
            set_cell_margins(c, 40, 40, 40, 40)
            set_cell_borders(c, color=HEX_BORDER)
            c.width = col_w_ps[c_i]

    add_heading(doc, "4. Brainstorming, Clustering & MoSCoW Prioritization", level=1)
    tbl_m = doc.add_table(rows=5, cols=3)
    tbl_m.alignment = WD_TABLE_ALIGNMENT.CENTER
    for c_i, th in enumerate(["Priority", "Selected Features", "Architectural Alignment"]):
        c = tbl_m.rows[0].cells[c_i]
        c.text = ""
        p = c.paragraphs[0]
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(th)
        r.bold = True
        r.font.size = Pt(8.5)
        r.font.color.rgb = RGBColor(255, 255, 255)
        set_cell_background(c, HEX_PRIMARY_BG)
        set_cell_margins(c, 50, 50, 60, 60)
        set_cell_borders(c, color=HEX_BORDER)

    moscow_master_data = [
        (
            "MUST HAVE\n(Core MVP)",
            "• JWT Token Auth & Bcrypt Security (/api/auth)\n"
            "• Full Workout CRUD Engine (/api/workouts)\n"
            "• Multi-Field Workout Search (/api/workouts/search)\n"
            "• Gemini AI Weekly Workout Planner (/api/ai/recommendation)\n"
            "• Gemini AI Fitness Insights Engine (/api/ai/insights)\n"
            "• Centralized Error Middleware & MVC Layering",
            "Delivers the end-to-end user journey: secure login, instant workout logging, and intelligent Gemini AI recommendations."
        ),
        (
            "SHOULD HAVE\n(v1.1 Release)",
            "• Daily Workout Streak Counter\n"
            "• Calorie Target Burn Estimator\n"
            "• Visual Category Ratio Breakdown\n"
            "• Motivational AI Coaching Quotes",
            "Enhances user engagement and provides rich graphical metrics on dashboard interfaces."
        ),
        (
            "COULD HAVE\n(v2.0 Roadmap)",
            "• Milestone Completion Badges\n"
            "• Exportable Workout Progress Cards\n"
            "• Interactive Natural Language Fitness Bot\n"
            "• Historical Month-over-Month Comparative Analytics",
            "Adds social sharing and real-time interactive chatbot interactions."
        ),
        (
            "WON'T HAVE\n(Deferred)",
            "• Real-Time BLE Smartwatch Hardware Sensor Sync\n"
            "• Competitive Multi-User Global Leaderboards\n"
            "• Live Streaming Video Gym Classes",
            "Hardware-dependent integrations reserved for future native mobile client releases."
        )
    ]
    col_w_m = [Inches(1.4), Inches(3.5), Inches(2.2)]
    for r_i, (prio, feats, arch) in enumerate(moscow_master_data):
        row = tbl_m.rows[r_i + 1]
        bg = HEX_CARD_BG if "MUST" in prio else ("FFFFFF" if r_i % 2 == 0 else HEX_ALT_ROW_BG)
        for c_i, val in enumerate([prio, feats, arch]):
            c = row.cells[c_i]
            c.text = ""
            p = c.paragraphs[0]
            p.paragraph_format.space_before = Pt(2)
            p.paragraph_format.space_after = Pt(2)
            r = p.add_run(val)
            r.font.size = Pt(8)
            r.font.color.rgb = COLOR_DARK
            if c_i == 0:
                r.bold = True
                if "MUST" in val:
                    r.font.color.rgb = COLOR_PRIMARY
                elif "SHOULD" in val:
                    r.font.color.rgb = COLOR_SECONDARY
                else:
                    r.font.color.rgb = COLOR_MUTED
            set_cell_background(c, bg)
            set_cell_margins(c, 40, 40, 50, 50)
            set_cell_borders(c, color=HEX_BORDER)
            c.width = col_w_m[c_i]

    add_heading(doc, "5. Architectural Blueprint & Verification", level=1)
    add_compact_paragraph(doc, "All Must-Have features defined in this Ideation Phase are fully implemented and verified in the FitTrack AI backend codebase (controllers, models, services, middleware, and 100% automated test suite passing).")

    out_downloads = os.path.join(DOWNLOADS_DIR, "FitTrack_AI_Brainstorming_and_Ideation_Phase_Report.docx")
    out_workspace = os.path.join(WORKSPACE_DIR, "FitTrack_AI_Brainstorming_and_Ideation_Phase_Report.docx")
    safe_save(doc, out_downloads)
    safe_save(doc, out_workspace)
    print("Regenerated FitTrack_AI_Brainstorming_and_Ideation_Phase_Report.docx cleanly!")

if __name__ == "__main__":
    print("Generating zero-whitespace, content-rich documents...")
    create_define_problem_statements_doc()
    create_empathy_map_doc()
    create_brainstorming_doc()
    create_master_report_doc()
    print("All documents generated with zero whitespace and high-density content!")
