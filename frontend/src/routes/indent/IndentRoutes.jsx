import { Routes, Route } from "react-router-dom";

import IndentList from "../../pages/indent/IndentList";
import IndentForm from "../../pages/indent/IndentForm";
import IndentView from "../../pages/indent/IndentView";
import IndentPrint from "../../pages/indent/IndentPrint";

export default function IndentRoutes() {

    return (

        <Routes>

            <Route
                index
                element={<IndentList />}
            />

            <Route
                path="new"
                element={<IndentForm />}
            />

            <Route
                path="edit/:id"
                element={<IndentForm />}
            />

            <Route
                path="view/:id"
                element={<IndentView />}
            />

            <Route
                path="print/:id"
                element={<IndentPrint />}
            />

        </Routes>

    );

}