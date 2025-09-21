import { FaGithub } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="footer footer-center p-4 bg-base-100 text-base-content mt-8">
      <div className="flex flex-col gap-2 items-center">
        <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
          <span>
            © {new Date().getFullYear()} Somniverse. All rights reserved.
          </span>
          <a
            href="https://github.com/wgrgwg/somniverse-backend"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-800"
          >
            <FaGithub size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}
