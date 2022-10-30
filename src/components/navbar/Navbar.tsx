import { MoonIcon, SunIcon } from "../../assets";
import "./navbar.scss";

const Navbar = ({ themeModeState }: any) => {
    return (
        <div id="NAVBAR">
            <div className="logo__name"> Medical Questions </div>
            {/* ───────────── THEME TOGGLE ─────────── */}
            <div
                className="theme__toggle"
                onClick={themeModeState.toggleThemeMode}
            >
                {themeModeState.themeMode === "night" ? (
                    <SunIcon />
                ) : (
                    <MoonIcon />
                )}
            </div>
            {/* ────────────────────────────────────── */}
        </div>
    );
};

export default Navbar;
