import { Outlet } from "react-router-dom";
import Navbar from "../navbar/Navbar";

export default function BasicOutline() {

    return (
        <div className="basicOutline">
            <Navbar />
            <Outlet />
        </div>

    )
}