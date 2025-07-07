import AddCatagory from "@/components/addCatagory/addCatagory"
import GoogleChartExample from "@/components/charts/day"
import EditMenuPanel from "@/components/editMenuPanel/editMenuPanel"
import { useEffect, useState } from "react"
import { Button, Container, Row } from "react-bootstrap"

export default function PanelAll() {
    const [showChart, setShowChart] = useState(false)
    const [showEditMenu, setShowEditMenu] = useState(false)
    const [showAddCatagory, setShowAddCatagory] = useState(false)
    const [selectsMenu, setSelectsMenu] = useState([])







    return (
        <Container>
            <Row>

                <div className="border p-2 col-lg-3 col-sm-12 ">
                    <div style={{position :'sticky' , top:'10rem'}}>

                        <Button onClick={() => { setShowEditMenu(true), setShowChart(false), setShowAddCatagory(false) }} className="m-1">ویرایش منو</Button>
                        <Button onClick={() => { setShowChart(true), setShowEditMenu(false), setShowAddCatagory(false) }} className="m-1">نمودار فروش</Button>
                        <Button onClick={() => { setShowChart(false), setShowEditMenu(false), setShowAddCatagory(true) }} className="m-1">افزودن منو</Button>
                    </div>

                </div>
                <div className="border col-lg-9 col-sm-12">
                    {showChart && <GoogleChartExample />}
                    {showEditMenu && <EditMenuPanel setSelectsMenu={setSelectsMenu} selectsMenu={selectsMenu} />}
                    {showAddCatagory && <AddCatagory setShowEditMenu={setShowEditMenu} setShowAddCatagory={setShowAddCatagory} />}
                </div>
            </Row>

        </Container>
    )
}


