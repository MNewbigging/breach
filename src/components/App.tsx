import { useEffect } from "react";
import "./app.scss";

export function App() {
  // Put version in title
  useEffect(() => {
    document.title = `Breach v${__APP_VERSION__}`;
  }, []);

  return <div className="app">Version: {__APP_VERSION__}</div>;
}
