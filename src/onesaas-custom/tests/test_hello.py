import subprocess
import sys

def test_hello_output():
    """hello.py가 '안녕하세요'를 정상적으로 출력하는지 테스트"""
    result = subprocess.run([sys.executable, "hello.py"], 
                          capture_output=True, text=True)
    
    assert "안녕하세요" in result.stdout, f"출력 실패: {result.stdout}"
    print("✓ 테스트 통과: '안녕하세요' 정상 출력됨")
    print(f"출력 내용: {result.stdout.strip()}")

if __name__ == "__main__":
    test_hello_output()