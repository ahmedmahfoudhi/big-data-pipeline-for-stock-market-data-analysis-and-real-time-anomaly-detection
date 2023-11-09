import ThemeSwitcher from "../components/ThemeSwitcher";

export default function Header() {
  return (
    <div className="flex items-center md:space-between">
      <p className="text-[30px] md:text-[33px] lg:text-[50px] flex-1 md:text-center">
        Welcome to Dashboard &#128075;{" "}
      </p>
      <ThemeSwitcher />
    </div>
  );
}
