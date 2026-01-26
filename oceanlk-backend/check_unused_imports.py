import re
import sys
import os

def check_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    lines = content.split('\n')
    imports = []
    # Identify imports
    for i, line in enumerate(lines):
        match = re.match(r'^\s*import\s+([\w\.]+);', line)
        if match:
            full_class = match.group(1)
            class_name = full_class.split('.')[-1]
            if not full_class.endswith('*'):
                imports.append({'full': full_class, 'name': class_name, 'line': i+1, 'raw': line})
    
    # Check usage
    # We remove the imports section from the check to avoid self-matching
    # Simpler: just check if class_name appears more than once (one for import)
    # But import might be multiline or something? No, Java imports are usually one line.
    
    unused = []
    for imp in imports:
        # Check if the simple name is used in the file content
        # We need to be careful about not matching the import line itself
        # Regex to find whole word usage
        # We just count occurrences of the class name in the whole file
        # If it occurs 1 time (in the import), it's unused.
        # Wait, if it's imported but fully qualified used, it will appear, but then why import?
        # If it's imported, usually short name is used.
        
        # Regex for whole word
        pattern = r'\b' + re.escape(imp['name']) + r'\b'
        matches = re.findall(pattern, content)
        
        if len(matches) <= 1:
            # Check if it is used in javadoc? (Usually unused import warning ignores javadoc usage in strict settings, but sometimes not)
            # Ignoring javadoc for now, assuming code usage.
            unused.append(imp)
            
    return unused

def main():
    if len(sys.argv) < 2:
        print("Usage: python check_unused.py <directory_or_file>")
        sys.exit(1)
        
    path = sys.argv[1]
    
    if os.path.isfile(path):
        files = [path]
    else:
        files = []
        for root, dirs, fnames in os.walk(path):
            for f in fnames:
                if f.endswith('.java'):
                    files.append(os.path.join(root, f))
                    
    for f in files:
        unused = check_file(f)
        if unused:
            print(f"File: {f}")
            for u in unused:
                print(f"  Unused Import (Line {u['line']}): {u['full']}")

if __name__ == "__main__":
    main()
