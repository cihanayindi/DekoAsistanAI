import os

mood_boards_path = r'c:\Users\suakb\supi\DekoAsistanAI\backend\data\mood_boards'
files = os.listdir(mood_boards_path)
print('Files:', files)

if files:
    file_path = os.path.join(mood_boards_path, files[-1])
    with open(file_path, 'rb') as f:
        data = f.read()
    
    print(f'File: {files[-1]}')
    print(f'Size: {len(data)} bytes')
    print(f'PNG header: {data[:8].hex()}')
    print(f'Is valid PNG: {data.startswith(b"\\x89PNG")}')
    
    # Check if it's the placeholder image
    import base64
    placeholder_b64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
    placeholder_bytes = base64.b64decode(placeholder_b64)
    
    print(f'Is placeholder: {data == placeholder_bytes}')
    print(f'Placeholder size: {len(placeholder_bytes)} bytes')
