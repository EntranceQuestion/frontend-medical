import React, { useEffect, useState, FC } from "react";
// import useLocalStorage from "use-local-storage";
// import { Routes, Route, useLocation } from "react-router-dom";
import { Navbar, Home } from "./components";
import "./app.scss";

const App: FC = () => {
    /* ──────────────────────────────────────────────────── */
    /* ─────────────────────  THEME  ────────────────────── */
    // const location = useLocation();
    // console.log(location.pathname);

    const [themeMode, setThemeMode] = useState<string | null>(null);
    const setStorageThemeMode = (value: string): void => {
        localStorage.setItem("themeMode", value);
    };

    const dayMode = () => {
        document.body.style.backgroundColor = "#ffffff";
        document.body.style.color = "#666666";
        setThemeMode("day");
        setStorageThemeMode("day");
    };
    const nightMode = () => {
        document.body.style.backgroundColor = "#000000";
        document.body.style.color = "#666666";
        setThemeMode("night");
        setStorageThemeMode("night");
    };

    useEffect(() => {
        const previousMode: any = localStorage.getItem("themeMode");

        if (previousMode === null) {
            dayMode();
        } else {
            previousMode === "day" ? dayMode() : nightMode();
        }
    }, [themeMode]);

    const toggleThemeMode = () => {
        const previousMode = localStorage.getItem("themeMode");
        previousMode === "day" ? nightMode() : dayMode();
    };
    /* ───────────────────  end THEME  ──────────────────── */
    /* ──────────────────────────────────────────────────── */

    return (
        <div id="APP">
            <div id="navbar">
                <Navbar themeModeState={{ toggleThemeMode, themeMode }} />
            </div>
            <div id="home">
                <Home themeMode={themeMode} />
            </div>
        </div>
    );
};

export default App;
