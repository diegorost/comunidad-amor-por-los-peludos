import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Layout } from "@/components/Layout"
import { Home } from "@/pages/Home"
import { Dogs } from "@/pages/Dogs"
import { AddDog } from "@/pages/AddDog"
import { EditDog } from "@/pages/EditDog"
import { Resources } from "@/pages/Resources"
import { AddResource } from "@/pages/AddResource"
import { EditResource } from "@/pages/EditResource"
import { Tips } from "@/pages/Tips"
import { AddTip } from "@/pages/AddTip"
import { EditTip } from "@/pages/EditTip"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="perritos" element={<Dogs />} />
          <Route path="anadir" element={<AddDog />} />
          <Route path="perritos/:id/editar" element={<EditDog />} />
          <Route path="recursos" element={<Resources />} />
          <Route path="recursos/anadir" element={<AddResource />} />
          <Route path="recursos/:id/editar" element={<EditResource />} />
          <Route path="tips" element={<Tips />} />
          <Route path="tips/anadir" element={<AddTip />} />
          <Route path="tips/:id/editar" element={<EditTip />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
