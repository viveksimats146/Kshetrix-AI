import json
import os

brain_dir = r"C:\Users\vivek\.gemini\antigravity\brain"
target_files = [
    "c:\\users\\vivek\\desktop\\pdd\\src\\screens\\dashboard.jsx",
    "c:\\users\\vivek\\desktop\\pdd\\src\\screens\\prediction.jsx",
    "c:\\users\\vivek\\desktop\\pdd\\src\\screens\\advancedfeatures.jsx",
    "c:\\users\\vivek\\desktop\\pdd\\src\\screens\\utilityscreens.jsx",
    "c:\\users\\vivek\\desktop\\pdd\\src\\screens\\profile.jsx",
    "c:\\users\\vivek\\desktop\\pdd\\src\\screens\\onboarding.jsx",
    "c:\\users\\vivek\\desktop\\pdd\\src\\screens\\basicscreens.jsx",
    "c:\\users\\vivek\\desktop\\pdd\\src\\screens\\community.jsx",
    "c:\\users\\vivek\\desktop\\pdd\\src\\screens\\education.jsx",
    "c:\\users\\vivek\\desktop\\pdd\\src\\screens\\extendedfeatures.jsx",
    "c:\\users\\vivek\\desktop\\pdd\\src\\screens\\finance.jsx",
    "c:\\users\\vivek\\desktop\\pdd\\src\\screens\\logistics.jsx",
    "c:\\users\\vivek\\desktop\\pdd\\src\\screens\\support.jsx"
]

file_contents = {tgt: "" for tgt in target_files}

transcript_files = []
for root, dirs, files in os.walk(brain_dir):
    for f in files:
        if f == "transcript.jsonl":
            transcript_files.append(os.path.join(root, f))

# Sort to process chronologically
transcript_files.sort(key=os.path.getmtime)
print(f"Found {len(transcript_files)} transcripts.")

for tf in transcript_files:
    try:
        with open(tf, 'r', encoding='utf-8') as f:
            for line in f:
                try:
                    data = json.loads(line)
                    if data.get('type') == 'PLANNER_RESPONSE' and 'tool_calls' in data:
                        for call in data['tool_calls']:
                            if call.get('name') == 'write_to_file' or call.get('name') == 'replace_file_content':
                                args = call.get('args', {})
                                target_raw = args.get('TargetFile', '')
                                try:
                                    target = json.loads(target_raw).lower()
                                except:
                                    target = target_raw.strip('"').replace('\\\\', '\\').lower()
                                
                                # Use CodeContent for write_to_file, ReplacementContent for replace_file_content (if modifying whole file)
                                code_raw = args.get('CodeContent', args.get('ReplacementContent', ''))
                                
                                if target in file_contents:
                                    try:
                                        code = json.loads(code_raw)
                                    except:
                                        code = code_raw
                                    
                                    if len(code) > 200 and "This screen is under construction" not in code:
                                        file_contents[target] = code
                except Exception as e:
                    pass
    except Exception as e:
        pass

for target, code in file_contents.items():
    if len(code) > 200:
        actual_path = target
        try:
            with open(actual_path, 'w', encoding='utf-8') as f:
                f.write(code)
            print(f"Successfully restored {actual_path}")
        except Exception as e:
            print(f"Failed to write {actual_path}: {e}")
    else:
        print(f"Could not find valid code for {target}")
