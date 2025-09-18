import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="text-center mt-16">
      <h1 className="text-4xl font-bold mb-6">
        🌙 꿈 기록 서비스에 오신 걸 환영합니다!
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        자신의 꿈을 기록하고, 다른 사람들의 꿈을 함께 나눠보세요.
      </p>
      <Link to="/dreams" className="btn btn-primary">
        공개 꿈 목록 보러가기
      </Link>
    </div>
  );
}
