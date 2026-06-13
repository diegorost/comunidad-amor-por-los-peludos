import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Layout } from "@/components/Layout"
import { Home } from "@/pages/Home"
import { Dogs } from "@/pages/Dogs"
import { AddDog } from "@/pages/AddDog"
import { Resources } from "@/pages/Resources"
import { AddResource } from "@/pages/AddResource"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="perritos" element={<Dogs />} />
          <Route path="anadir" element={<AddDog />} />
          <Route path="recursos" element={<Resources />} />
          <Route path="recursos/anadir" element={<AddResource />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
