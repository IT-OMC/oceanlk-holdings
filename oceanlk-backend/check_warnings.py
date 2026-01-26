import re
import sys
import os

def check_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    lines = content.split('\n')
    issues = []
    
    # 1. Check unused imports (existing logic)
    imports = []
    for i, line in enumerate(lines):
        match = re.match(r'^\s*import\s+([\w\.]+);', line)
        if match:
            full_class = match.group(1)
            class_name = full_class.split('.')[-1]
            if not full_class.endswith('*'):
                imports.append({'full': full_class, 'name': class_name, 'line': i+1})
    
    for imp in imports:
        pattern = r'\b' + re.escape(imp['name']) + r'\b'
        matches = re.findall(pattern, content)
        if len(matches) <= 1:
            issues.append(f"Unused Import (Line {imp['line']}): {imp['full']}")

    # 2. Check Raw Types
    # Look for List/Map/Set/ResponseEntity followed by variable name without <
    # Avoid capturing "List<String> list"
    # match "List list" or "List  list" or "public List getList()"
    # Regex: \b(List|Map|Set|ResponseEntity|ArrayList|HashMap|HashSet)\s+(?!<)[a-zA-Z_]
    # AND also match return types: "public List method()"
    
    raw_type_pattern = re.compile(r'\b(List|Map|Set|ResponseEntity|ArrayList|HashMap|HashSet)\s+(?!<)([a-zA-Z_]\w*)')
    
    # Iterate lines to get line numbers
    for i, line in enumerate(lines):
        # Skip import lines
        if line.strip().startswith('import'):
            continue
            
        for match in raw_type_pattern.finditer(line):
            type_name = match.group(1)
            var_name = match.group(2)
            # Filter out some false positives if any? 
            # e.g. "List.of()" - but \s+ ensures space.
            issues.append(f"Raw Type (Line {i+1}): {type_name} {var_name}")
            
    # 3. Check for @Override missing (simple heuristic: method matches standard overrides like toString, equals, hashCode)
    # or if it implements an interface method (hard without full analysis).
    # Just check standard Object methods for now.
    
    std_overrides = ['toString', 'equals', 'hashCode']
    for i, line in enumerate(lines):
        if 'public ' in line:
            for meth in std_overrides:
                if f' {meth}(' in line:
                    # check if previous non-empty line has @Override
                    # Scanning backwards
                    j = i - 1
                    has_override = False
                    while j >= 0:
                        prev = lines[j].strip()
                        if prev == '':
                            j -= 1
                            continue
                        if '@Override' in prev:
                            has_override = True
                        break
                    
                    if not has_override:
                        issues.append(f"Missing @Override (Line {i+1}): {meth}")

    # 4. Check Unused Private Fields
    # Pattern: private Type name;
    # Then check if 'name' is used > 1 time (definition)
    # Ignore if @Autowired or @Value is present (Spring)
    
    field_pattern = re.compile(r'^\s*private\s+[\w<>?,\s]+\s+(\w+)\s*;')
    
    for i, line in enumerate(lines):
        match = field_pattern.match(line)
        if match:
            var_name = match.group(1)
            # Check for annotations above
            j = i - 1
            is_injected = False
            while j >= 0:
                prev = lines[j].strip()
                if prev == '':
                    j -= 1
                    continue
                if prev.startswith('@Autowired') or prev.startswith('@Value') or prev.startswith('@Mock'):
                    is_injected = True
                break
            
            if is_injected:
                continue
                
            # Check usage in whole content
            # pattern: boundary var_name boundary
            usage_matches = re.findall(r'\b' + re.escape(var_name) + r'\b', content)
            if len(usage_matches) <= 1: # Only found the declaration
                 issues.append(f"Unused Private Field (Line {i+1}): {var_name}")

    return issues

def main():
    if len(sys.argv) < 2:
        print("Usage: python check_all.py <directory_or_file>")
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
        issues = check_file(f)
        if issues:
            print(f"File: {f}")
            for issue in issues:
                print(f"  {issue}")

if __name__ == "__main__":
    main()
