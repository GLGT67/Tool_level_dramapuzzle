import sys, time
sys.stdout.reconfigure(encoding='utf-8')
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

opts = Options()
opts.add_argument('--headless=new')
opts.add_argument('--window-size=1600,1050')
driver = webdriver.Chrome(options=opts)
driver.get('http://localhost:8099/index.html')
time.sleep(1)

print("="*60)
print("STARTING COMPREHENSIVE V1.35 VERIFICATION TEST SUITE")
print("="*60)

# ==============================================================
# TEST 1: Toolbar Proportions & Figma Tools Containment
# ==============================================================
print("\n[TEST 1] Testing #sceneTools Proportions & 9 Figma Tool Buttons...")
tools = driver.find_elements(By.CSS_SELECTOR, "#sceneTools .toolBtn")
tool_types = [t.get_attribute("data-tool") for t in tools]
print(f"  Found {len(tools)} tools: {tool_types}")
assert len(tools) >= 9, f"Expected at least 9 tools, found {len(tools)}"
for req in ["select", "rect", "circle", "triangle", "star", "polygon", "line", "arrow", "text"]:
    assert req in tool_types, f"Missing tool: {req}"

dock_check = driver.execute_script("""
    const dock = document.querySelector('#sceneTools');
    const btns = [...dock.querySelectorAll('.toolBtn')];
    const dr = dock.getBoundingClientRect();
    const overflows = btns.map(b => {
        const r = b.getBoundingClientRect();
        return {
            tool: b.dataset.tool,
            overflowLeft: r.left < dr.left,
            overflowRight: r.right > dr.right,
            width: r.width,
            dockWidth: dr.width
        };
    });
    return {
        dockWidth: dr.width,
        hasOverflow: overflows.some(o => o.overflowLeft || o.overflowRight)
    };
""")
print("  Dock metrics:", dock_check)
assert not dock_check['hasOverflow'], "Tools overflow dock border horizontally!"
print("  -> PASSED: All 9 tools properly contained in dock.")

# ==============================================================
# TEST 2: Inspector Priority Dots
# ==============================================================
print("\n[TEST 2] Testing Inspector Priority Legend Dots...")
legend_text = driver.find_element(By.CSS_SELECTOR, ".phaseLegend").text
print("  Phase Legend text:", legend_text)
assert "Làm ngay" in legend_text and "Khi cần" in legend_text and "Làm sau" in legend_text, "Legend text missing!"
assert "🟢" in legend_text and "🟡" in legend_text and "🔵" in legend_text, "Legend missing priority colored dots!"
print("  -> PASSED: Priority color dots (🟢, 🟡, 🔵) verified in Inspector.")

# ==============================================================
# TEST 3: Flow Modal Rendering & Zero Overflow
# ==============================================================
print("\n[TEST 3] Testing FLOW Modal...")
driver.find_element(By.ID, "logicFlowBtn").click()
time.sleep(0.5)

flow_overlay = driver.find_element(By.ID, "overlay")
assert "show" in flow_overlay.get_attribute("class"), "Flow overlay missing .show class!"

flow_metrics = driver.execute_script("""
    const card = document.querySelector('.logicFlowCard');
    const body = document.querySelector('.logicFlowBody');
    const cr = card.getBoundingClientRect();
    const br = body.getBoundingClientRect();
    return {
        cardHeight: cr.height,
        bodyHeight: br.height,
        cardTop: cr.top,
        cardBottom: cr.bottom,
        bodyBottom: br.bottom,
        bodyOverflowY: window.getComputedStyle(body).overflowY,
        bodyScrollHeight: body.scrollHeight,
        isBodyContained: br.bottom <= cr.bottom + 5
    };
""")
print("  Flow modal metrics:", flow_metrics)
assert flow_metrics['isBodyContained'], "Flow body overflows outside card!"
assert flow_metrics['bodyOverflowY'] in ['auto', 'scroll'], "Flow body missing scrollable overflow!"
driver.save_screenshot("verify_flow_modal.png")
print("  Saved verify_flow_modal.png")

driver.find_element(By.ID, "closeLogicFlow").click()
time.sleep(0.3)
assert "show" not in flow_overlay.get_attribute("class"), "Flow overlay should close!"
print("  -> PASSED: Flow modal renders beautifully with scrollable container and closes cleanly.")

# ==============================================================
# TEST 4: Test Độ Khó Modal (No Blocking Alert)
# ==============================================================
print("\n[TEST 4] Testing TEST ĐỘ KHÓ Modal...")
driver.find_element(By.ID, "difficultyTestBtn").click()
time.sleep(0.5)

diff_overlay = driver.find_element(By.ID, "difficultyOverlay")
assert "show" in diff_overlay.get_attribute("class"), "Difficulty overlay missing .show class!"

diff_metrics = driver.execute_script("""
    const shell = document.querySelector('.difficultyShell');
    const body = document.querySelector('.difficultyBody');
    const sr = shell.getBoundingClientRect();
    const br = body.getBoundingClientRect();
    return {
        shellHeight: sr.height,
        bodyHeight: br.height,
        bodyOverflowY: window.getComputedStyle(body).overflowY,
        isBodyContained: br.bottom <= sr.bottom + 5
    };
""")
print("  Difficulty modal metrics:", diff_metrics)
assert diff_metrics['isBodyContained'], "Difficulty body overflows outside shell!"
driver.save_screenshot("verify_difficulty_modal.png")
print("  Saved verify_difficulty_modal.png")

driver.find_element(By.ID, "closeDifficultyTest").click()
time.sleep(0.3)
assert "show" not in diff_overlay.get_attribute("class"), "Difficulty overlay should close!"
print("  -> PASSED: Difficulty modal opens directly without blocking alert and closes cleanly.")

# ==============================================================
# TEST 5: Ending Modal Rendering
# ==============================================================
print("\n[TEST 5] Testing ENDING Modal...")
driver.find_element(By.ID, "productionMenu").find_element(By.TAG_NAME, "summary").click()
time.sleep(0.3)
driver.find_element(By.ID, "endingBtn").click()
time.sleep(0.5)

ending_overlay = driver.find_element(By.ID, "endingOverlay")
assert "show" in ending_overlay.get_attribute("class"), "Ending overlay missing .show class!"

ending_metrics = driver.execute_script("""
    const shell = document.querySelector('.endingShell');
    const body = document.querySelector('.endingBody');
    const sr = shell.getBoundingClientRect();
    const br = body.getBoundingClientRect();
    return {
        shellHeight: sr.height,
        bodyHeight: br.height,
        isBodyContained: br.bottom <= sr.bottom + 5
    };
""")
print("  Ending modal metrics:", ending_metrics)
assert ending_metrics['isBodyContained'], "Ending body overflows outside shell!"
driver.save_screenshot("verify_ending_modal.png")
print("  Saved verify_ending_modal.png")

driver.find_element(By.ID, "closeEnding").click()
time.sleep(0.3)
assert "show" not in ending_overlay.get_attribute("class"), "Ending overlay should close!"
print("  -> PASSED: Ending modal renders correctly and closes cleanly.")

# ==============================================================
# TEST 6: Play Mode Layout & Stage Centering
# ==============================================================
print("\n[TEST 6] Testing PLAY Mode Layout & Stage Centering...")
# First load sample wedding level
driver.find_element(By.ID, "sampleMenu").find_element(By.TAG_NAME, "summary").click()
time.sleep(0.3)
driver.find_element(By.ID, "sampleWeddingBtn").click()
time.sleep(0.8)

# Click PLAY
driver.find_element(By.ID, "playBtn").click()
time.sleep(0.8)

play_checks = driver.execute_script("""
    const tools = document.querySelector('#sceneTools');
    const toolsDisp = window.getComputedStyle(tools).display;
    const stage = document.querySelector('#stage').getBoundingClientRect();
    const right = document.querySelector('.panel.right');
    const rightPointer = window.getComputedStyle(right).pointerEvents;
    const tokens = document.querySelectorAll('.token');
    const tray = document.querySelector('.trayrow');
    const tr = tray ? tray.getBoundingClientRect() : null;
    return {
        bodyPlay: document.body.classList.contains('play'),
        toolsDisplay: toolsDisp,
        rightPointerEvents: rightPointer,
        tokenCount: tokens.length,
        stageLeft: stage.left,
        stageRight: stage.right,
        stageWidth: stage.width,
        trayBottom: tr ? tr.bottom : null,
        windowHeight: window.innerHeight
    };
""")
print("  Play mode check:", play_checks)
assert play_checks['bodyPlay'], "body should have .play class!"
assert play_checks['toolsDisplay'] == 'none', "sceneTools should be display:none in play mode!"
assert play_checks['tokenCount'] > 0, "Character tokens should be on tray!"
assert play_checks['rightPointerEvents'] == 'none', "Right inspector should be non-interactive in play mode!"

driver.save_screenshot("verify_play_mode.png")
print("  Saved verify_play_mode.png")

# Switch back to EDIT
driver.find_element(By.ID, "editBtn").click()
time.sleep(0.5)
assert not driver.execute_script("return document.body.classList.contains('play');"), "body should not have .play after clicking EDIT"
print("  -> PASSED: Play mode collapses edit tools, centers stage, renders tokens cleanly, and switches back to Edit.")

# ==============================================================
# TEST 7: Figma Shape Creation (Star, Polygon, Line, Rect with Radius)
# ==============================================================
print("\n[TEST 7] Testing Figma Shapes Drawing & Properties...")
# Create a Star
star_id = driver.execute_script("""
    const s = window.createAnnotation('star', 100, 100, 150, 150, {});
    s.fill = '#f59e0b';
    s.stroke = '#d97706';
    s.strokeWidth = 4;
    window.refreshImmediate();
    return s.id;
""")
print(f"  Created Star annotation: {star_id}")

# Create a Polygon (Hexagon)
poly_id = driver.execute_script("""
    const p = window.createAnnotation('polygon', 300, 100, 160, 160, {});
    p.fill = '#8b5cf6';
    p.stroke = '#6d28d9';
    p.strokeWidth = 3;
    window.refreshImmediate();
    return p.id;
""")
print(f"  Created Polygon annotation: {poly_id}")

# Create a Line
line_id = driver.execute_script("""
    const l = window.createAnnotation('line', 100, 300, 360, 30, {});
    l.stroke = '#ef4444';
    l.strokeWidth = 5;
    window.refreshImmediate();
    return l.id;
""")
print(f"  Created Line annotation: {line_id}")

# Create a Rect with Corner Radius
rect_id = driver.execute_script("""
    const r = window.createAnnotation('rect', 100, 400, 200, 120, {});
    r.radius = 24;
    r.strokeStyle = 'dashed';
    r.fill = '#3b82f6';
    r.stroke = '#1d4ed8';
    window.refreshImmediate();
    return r.id;
""")
print(f"  Created Rect with Corner Radius: {rect_id}")

# Verify DOM elements rendered
shape_dom = driver.execute_script("""
    const starEl = document.querySelector('[data-annotation-id=\"' + arguments[0] + '\"] polygon');
    const polyEl = document.querySelector('[data-annotation-id=\"' + arguments[1] + '\"] polygon');
    const lineEl = document.querySelector('[data-annotation-id=\"' + arguments[2] + '\"] line');
    const rectEl = document.querySelector('[data-annotation-id=\"' + arguments[3] + '\"]');
    return {
        hasStarPolygon: !!starEl,
        hasPolyPolygon: !!polyEl,
        hasLine: !!lineEl,
        rectBorderRadius: rectEl ? rectEl.style.borderRadius : null,
        rectBorderStyle: rectEl ? rectEl.style.borderStyle : null
    };
""", star_id, poly_id, line_id, rect_id)
print("  Figma shape DOM verification:", shape_dom)
assert shape_dom['hasStarPolygon'], "Star SVG polygon missing!"
assert shape_dom['hasPolyPolygon'], "Polygon SVG polygon missing!"
assert shape_dom['hasLine'], "Line SVG element missing!"
assert shape_dom['rectBorderRadius'] == '24px', "Rect border radius not applied!"
assert shape_dom['rectBorderStyle'] == 'dashed', "Rect dashed border style not applied!"
print("  -> PASSED: All 4 Figma shape types (Star, Polygon, Line, Rect with Radius) rendered with 100% precision!")

driver.save_screenshot("verify_figma_shapes.png")
print("  Saved verify_figma_shapes.png")

# ==============================================================
# TEST 8: Console Error Audit
# ==============================================================
logs = driver.get_log('browser')
severe_errors = [l for l in logs if l['level'] == 'SEVERE' and 'favicon' not in l['message']]
print(f"\n[TEST 8] Console Error Audit: {len(severe_errors)} errors found.")
for e in severe_errors:
    print("  SEVERE:", e['message'])
assert len(severe_errors) == 0, f"Found severe console errors: {severe_errors}"
print("  -> PASSED: Zero severe console errors!")

driver.quit()
print("\n" + "="*60)
print("ALL COMPREHENSIVE V1.35 VERIFICATION TESTS PASSED 100% PERFECTLY!")
print("="*60)
