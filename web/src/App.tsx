import { Navigate, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { Redirect } from "./pages/Redirect";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/:shortenedUrl" element={<Redirect />} />
			<Route path="/not-found" element={<NotFound />} />
			<Route path="*" element={<Navigate to="/not-found" replace />} />
		</Routes>
	);
}

export default App;
