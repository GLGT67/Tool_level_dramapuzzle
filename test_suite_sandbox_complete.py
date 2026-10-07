import sys, time
sys.stdout.reconfigure(encoding='utf-8')
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

opts = Options()
opts.add_argument('--headless=new')
opts.add_argument('--window-size=1600,1100')
driver = webdriver.Chrome(options=opts)
driver.get('http://localhost:8099/index.html')
time.sleep(1)

print("--- RUNNING FULL SANDBOX INTEGRATION SUITE ---")

# 1. Test Arrows across all 8 directions
directions = [
    ('dirR', 'Right (➡)'),
    ('dirL', 'Left (⬅)'),
    ('dirD', 'Down (⬇)'),
    ('dirU', 'Up (⬆)'),
    ('dirDR', 'Diagonal Down-Right (↘)'),
    ('dirDL', 'Diagonal Down-Left (↙)'),
    ('dirUR', 'Diagonal Up-Right (↗)'),
    ('dirUL', 'Diagonal Up-Left (↖)'),
]

# Click Arrow tool
driver.find_element(By.CSS_SELECTOR, 'button[data-tool="arrow"]').click()

# Draw an arrow
driver.execute_script("""
  const stage = document.querySelector('#stage');
  const rect = stage.getBoundingClientRect();
  stage.dispatchEvent(new PointerEvent('pointerdown', {clientX: rect.left + 200, clientY: rect.top + 200, button: 0, bubbles: true}));
  window.dispatchEvent(new PointerEvent('pointermove', {clientX: rect.left + 350, clientY: rect.top + 350, bubbles: true}));
  window.dispatchEvent(new PointerEvent('pointerup', {clientX: rect.left + 350, clientY: rect.top + 350, bubbles: true}));
""")
time.sleep(0.3)

for btn_id, label in directions:
    b = driver.find_element(By.ID, btn_id)
    b.click()
    time.sleep(0.1)
    pts = driver.execute_script("return document.querySelector('.noteObj.arrow polygon').getAttribute('points');")
    assert pts and len(pts) > 10, f"Arrow points invalid for {label}"
    print(f"  [PASS] Direction {label}: points = {pts[:30]}...")

# 2. Test Image Center Transform Origin on .imgLayer
img_check = driver.execute_script("""
  const sheets = [...document.styleSheets];
  let foundTransformOrigin = false;
  for(const s of sheets) {
    try {
      for(const r of s.cssRules) {
        if(r.selectorText && r.selectorText.includes('.imgLayer') && r.style.transformOrigin.includes('center')) {
          foundTransformOrigin = true;
        }
      }
    }catch(e){}
  }
  return foundTransformOrigin;
""")
print(f"  [PASS] Image center transform-origin defined on .imgLayer: {img_check}")
assert img_check, "Image transform-origin center not found in CSS for .imgLayer"

# 3. Test Clue Tree container #clueList
clue_check = driver.execute_script("""
  const tree = document.querySelector('#clueList');
  return { found: !!tree };
""")
print(f"  [PASS] Clue tree container present: {clue_check['found']}")
assert clue_check['found'], "Clue tree container #clueList not found"

# 4. Check for any JavaScript errors in console logs
logs = driver.get_log('browser')
errors = [l for l in logs if l['level'] == 'SEVERE' and 'favicon' not in l['message']]
print(f"  [INFO] Browser console errors: {len(errors)}")
for e in errors:
    print("   Console Error:", e['message'])

assert len(errors) == 0, f"Severe console errors detected: {errors}"

driver.save_screenshot("sandbox_suite_verified.png")
print("  [PASS] Final suite screenshot saved: sandbox_suite_verified.png")
driver.quit()
print("\n--- ALL SANDBOX TESTS PASSED WITH ZERO ERRORS ---")
