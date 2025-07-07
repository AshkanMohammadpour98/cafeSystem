import axios from "axios";
import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import Swal from "sweetalert2";

export default function AddCatagory({setShowEditMenu , setShowAddCatagory}) {
    const [newCatagory, setNewCatagory] = useState({})

    const inputChange = (e) => {
        // console.log(e.target.id);
        // console.log(e.target.value);
        (e.target.id === 'price' || e.target.id === 'cost') ?
            (setNewCatagory({ ...newCatagory, [e.target.id]: Number(e.target.value) })) :
            (setNewCatagory({ ...newCatagory, [e.target.id]: e.target.value }))

    }

    return (
        <Container className="py-4">

            <Form lang="fa" dir="rtl">
                <h5 className="text-center text-primary my-2">افزودن دسته بندی</h5>
                <Row className="border py-2">
                    <Col >
                        <Form.Label className="text-black-50">نام دسته بندی</Form.Label>
                        <Form.Control placeholder="مثلا قهوه ها" id="catagory" className="w-50  " onChange={inputChange} />
                    </Col>
                </Row>
                <h5 className="text-center text-primary my-2">افزودن زیر منو</h5>
                <Row className="border py-2">
                    <Col>
                        <Form.Label className="text-black-50">نام</Form.Label>
                        <Form.Control placeholder="مثلا اسپرسو" id="name" onChange={inputChange} />
                    </Col>
                    <Col>
                        <Form.Label className="text-black-50">قیمت (پایه)</Form.Label>
                        <Form.Control type="number" placeholder="مثلا 40.000" id="cost" onChange={inputChange} />
                    </Col>                    <Col>
                        <Form.Label className="text-black-50">قیمت (فروش)</Form.Label>
                        <Form.Control type="number" placeholder="مثلا 55.000" id="price" onChange={inputChange} />
                    </Col>
                </Row>
                <Button className="my-4" onClick={() => {
                    // console.log(newCatagory);

                    if (newCatagory.catagory && newCatagory.name && newCatagory.price && newCatagory.cost) {
                        try {
                            axios.post("http://localhost:3001/dataMenu", newCatagory);
                            axios.post("http://localhost:3001/catagory", {name : newCatagory.catagory});

                            Swal.fire({
                                icon: "success",
                                title: "افزودن دسته بندی جدید با موفقیت انجام شد",
                                showConfirmButton: false,
                                timer: 1500
                            });


                        } catch (err) {
                            console.error("خطا در افزودن دسته بندی جدید:", err);
                            Swal.fire({
                                icon: "error",
                                title: "خطا در افزودن دسته بندی جدید",
                                text: "لطفاً دوباره تلاش کنید."
                            });
                        }
                        setShowEditMenu(true)
                    setShowAddCatagory(false)

                    } else {
                        // console.log('فیلد ها ناقص پر شده');
                         Swal.fire({
                              title: "همه فیلد ها را پر کنید",
                              text: "قبل از ثبت لطفا همه فیلد ها را پر کنید",
                              icon: "warning"
                            });

                    }
                    

                }}>افزودن دسته بندی</Button>
                <Button className="mx-4" onClick={()=>{
                    setShowEditMenu(true)
                    setShowAddCatagory(false)
                }}>بستن</Button>
            </Form>

        </Container>
    )
}