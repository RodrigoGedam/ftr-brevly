import { Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { Home } from "./pages/Home";
import { Redirect } from "./pages/Redirect";

function App() {
	return (
		<>
			<Toaster />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/:shortenedUrl" element={<Redirect />} />
			</Routes>
		</>
	);
}

export default App;
