import React, { lazy } from "react";
import ReactDOM from "react-dom";
import { queryCache, ReactQueryConfigProvider } from "react-query";
import Button from "./components/Button";
import ErrorBoundary from "./components/ErrorBoundary";
import { fetchProjects } from "./queries";
import "./styles.css";

const Projects = lazy(() => import("./components/Projects"));
const Project = lazy(() => import("./components/Project"));

const queryConfig = {
  suspense: true
};

function App() {
  const [showProjects, setShowProjects] = React.useState(false);
  const [activeProject, setActiveProject] = React.useState(null);

  return (
    <ReactQueryConfigProvider config={queryConfig}>
      <Button
        onClick={() => {
          setShowProjects(old => {
            if (!old) {
              queryCache.prefetchQuery("projects", fetchProjects);
            }
            return !old;
          });
        }}
      >
        {showProjects ? "Hide Projects" : "Show Projects"}
      </Button>

      <hr />

      <ErrorBoundary>
        <React.Suspense fallback={<h1>Loading projects...</h1>}>
          {showProjects ? (
            activeProject ? (
              <Project
                activeProject={activeProject}
                setActiveProject={setActiveProject}
              />
            ) : (
              <Projects setActiveProject={setActiveProject} />
            )
          ) : null}
        </React.Suspense>
      </ErrorBoundary>
    </ReactQueryConfigProvider>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.createRoot(rootElement).render(<App />);
