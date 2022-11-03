import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "../../assets";
import "./navbar.scss";

const Navbar = ({ themeModeState }: any) => {
    const [navShadowColor, setNavShadowColor] = useState("nav__shadow-day")
    useEffect(()=> {
        themeModeState === "day"? setNavShadowColor("nav__shadow-day"): setNavShadowColor("nav__shadow-night")
    }, [navShadowColor])
    return (
        <div id="NAVBAR" className={navShadowColor}>
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
