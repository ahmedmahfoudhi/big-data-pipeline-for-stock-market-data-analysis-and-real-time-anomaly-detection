import { AiFillHeart } from "react-icons/ai";
export default function Footer() {
  return (
    <div className="bg-footer-bkg mt-10 text-footer-text p-8 tracking-wide">
      <div className="flex items-center justify-center">
        <p>Made with</p>
        <span className="text-orange-700 mx-1 animate-pulse">
          <AiFillHeart />
        </span>
        <p>
          by <span className="font-bold"> Ahmed Mahfoudhi</span>
        </p>
      </div>
    </div>
  );
}
