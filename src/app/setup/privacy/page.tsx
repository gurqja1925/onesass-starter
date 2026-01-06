import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="mb-12">
        <Link href="/" className="text-purple-400 hover:text-purple-300 text-sm">
          ← 홈으로 돌아가기
        </Link>
        <h1 className="text-3xl font-bold text-white mt-4 mb-2">개인정보처리방침</h1>
        <p className="text-gray-400">최종 수정일: 2024년 1월 1일</p>
      </div>

      <div className="prose prose-invert max-w-none">
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">1. 개인정보의 처리 목적</h2>
            <p className="text-gray-300 leading-relaxed">
              OneSaaS(이하 &quot;회사&quot;)는 다음의 목적을 위하여 개인정보를 처리합니다.
              처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며,
              이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mt-4">
              <li>회원 가입 및 관리</li>
              <li>서비스 제공</li>
              <li>결제 및 환불 처리</li>
              <li>마케팅 및 광고 활용 (동의한 경우)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">2. 처리하는 개인정보의 항목</h2>
            <p className="text-gray-300 leading-relaxed">
              회사는 다음의 개인정보 항목을 처리하고 있습니다:
            </p>
            <div className="mt-4 space-y-4">
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
                <h3 className="text-white font-medium mb-2">필수 항목</h3>
                <p className="text-gray-400 text-sm">이메일, 비밀번호, 이름</p>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
                <h3 className="text-white font-medium mb-2">선택 항목</h3>
                <p className="text-gray-400 text-sm">전화번호, 프로필 이미지, 회사명</p>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
                <h3 className="text-white font-medium mb-2">자동 수집 항목</h3>
                <p className="text-gray-400 text-sm">IP 주소, 접속 로그, 서비스 이용 기록</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">3. 개인정보의 처리 및 보유 기간</h2>
            <p className="text-gray-300 leading-relaxed">
              회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mt-4">
              <li>회원 정보: 회원 탈퇴 시까지</li>
              <li>결제 기록: 5년 (전자상거래법)</li>
              <li>접속 기록: 3개월 (통신비밀보호법)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">4. 개인정보의 제3자 제공</h2>
            <p className="text-gray-300 leading-relaxed">
              회사는 원칙적으로 정보주체의 개인정보를 수집·이용 목적으로 명시한 범위 내에서 처리하며,
              다음의 경우를 제외하고는 정보주체의 사전 동의 없이는 본래의 목적 범위를 초과하여 처리하거나 제3자에게 제공하지 않습니다.
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mt-4">
              <li>정보주체로부터 별도의 동의를 받은 경우</li>
              <li>법률에 특별한 규정이 있는 경우</li>
              <li>서비스 제공에 필수적인 결제 처리 (PortOne, 토스페이먼츠)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">5. 개인정보의 파기</h2>
            <p className="text-gray-300 leading-relaxed">
              회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는
              지체없이 해당 개인정보를 파기합니다.
            </p>
            <p className="text-gray-300 leading-relaxed mt-2">
              전자적 파일 형태의 정보는 복구할 수 없는 방법으로 영구 삭제하며,
              그 외의 기록물, 인쇄물, 서면 등은 분쇄하거나 소각하여 파기합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">6. 정보주체의 권리·의무</h2>
            <p className="text-gray-300 leading-relaxed">
              정보주체는 다음과 같은 권리를 행사할 수 있습니다:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mt-4">
              <li>개인정보 열람 요구</li>
              <li>오류 등이 있을 경우 정정 요구</li>
              <li>삭제 요구</li>
              <li>처리정지 요구</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">7. 개인정보 보호책임자</h2>
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <p className="text-gray-300">
                <span className="text-white font-medium">담당부서:</span> 개인정보보호팀
              </p>
              <p className="text-gray-300 mt-2">
                <span className="text-white font-medium">이메일:</span> privacy@onesaas.kr
              </p>
              <p className="text-gray-400 text-sm mt-4">
                개인정보 처리에 관한 문의, 불만처리, 피해구제 등에 관한 사항은
                위 연락처로 문의주시면 신속하게 답변해 드리겠습니다.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">8. 쿠키(Cookie)의 사용</h2>
            <p className="text-gray-300 leading-relaxed">
              회사는 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용정보를 저장하고
              수시로 불러오는 &apos;쿠키(cookie)&apos;를 사용합니다.
            </p>
            <p className="text-gray-300 leading-relaxed mt-2">
              이용자는 웹브라우저의 옵션을 설정함으로써 모든 쿠키를 허용하거나,
              쿠키가 저장될 때마다 확인을 거치거나, 모든 쿠키의 저장을 거부할 수도 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">9. 개인정보처리방침의 변경</h2>
            <p className="text-gray-300 leading-relaxed">
              이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는
              변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
