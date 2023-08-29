import { Route, useNavigate } from "react-router-dom";
import {RouteLocations} from '../../app/RouteLocations';
import "./ErrorPage.css";

export default function ErrorPage() {
  const navigate = useNavigate()
  return (
    <div className="errorPage">
      <div className="errorPage-content">
        <h1 className="errorPage-content-title">404's and Heartbreaks</h1>
        <p className="errorPage-content-text">
          Sorry, we couldn't find the page you were looking for.
        </p>
        <p className="errorPage-content-text-link" onClick={() => {
            navigate(RouteLocations.discovery)
        }}>
          Please head back to the home page
        </p>
      </div>
    </div>
  );
}
