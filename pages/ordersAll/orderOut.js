import { Container, Row, Col, Table, Alert, Button } from "react-bootstrap";
import MenuCafe from "@/components/menuCafe/menuCafe";
import { useEffect, useState } from "react";
import { MdMenuBook, MdTextDecrease, MdKeyboardArrowDown } from "react-icons/md";
import { IoCloseCircle } from "react-icons/io5";
import axios from "axios";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import Swal from "sweetalert2";

export default function OrderOut() {
    const [selectsMenu, setSelectsMenu] = useState([]);
    const [itemCalculator, setItemCalculator] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);


    // تاریخ امروز شمسی
    const today = new DateObject({ calendar: persian, locale: persian_fa });
    const todayNow = today.format("YYYY/MM/DD");
    const todayY = today.format('YYYY')
    const todayM = today.format('MM')
    const todayD = today.format('DD')

    const toggleMenu = (e) => {
        e.stopPropagation();
        setIsMenuOpen(prev => !prev);
    };
    useEffect(() => {
        if (selectsMenu.length > 0) {
            const calculated = selectsMenu.map(item => ({
                id: item.id,
                totalPriceItem: item.price * item.count,
                price: item.price,
                count: item.count,
                name: item.name,
                cost: item.cost,
            }));
            setItemCalculator(calculated);
            const total = calculated.reduce((sum, item) => sum + item.totalPriceItem, 0);
            setTotalPrice(total);
        } else {
            setItemCalculator([]);
            setTotalPrice(0);
        }
    }, [selectsMenu]);

    const removeItemHandler = (name) => {
        setSelectsMenu(prev => prev.filter(item => item.name !== name));
    };

    const decreaseCountHandler = (name) => {
        setSelectsMenu(prev =>
            prev.map(item =>
                item.name === name ? { ...item, count: item.count - 1 } : item
            ).filter(item => item.count > 0)
        );
    };

    const addOrderOut = async () => {
        if (selectsMenu.length >= 1) {
            try {

                await axios.post("http://localhost:3001/dataOrderOut", {
                    itemCalculator,
                    totalPrice,
                    date: todayNow
                    // date: [
                    //     { todayNow },
                    //     { todayY },
                    //     { todayM },
                    //     { todayD }
                    // ],
                });
                Swal.fire({
                    text: `سفارش بیرون بر با موفقیت ثبت شد`,
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                });

                // پاک کردن فرم بعد از ثبت
                setSelectsMenu([]);
            } catch (err) {
                console.error("خطا در ثبت سفارش بیرون بر");
            }
        }
    };

    return (
        <>
            <h1 className="text-center my-4">سفارش بیرون بر</h1>

            <Container dir="rtl">
                <Row>
                    <div className="d-block d-md-none position-relative z-3 bg-white p-2 border" onClick={toggleMenu} style={{ cursor: "pointer" }}>
                        <MdMenuBook /> منو
                        <MdKeyboardArrowDown style={{ transition: "transform 0.3s", transform: isMenuOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
                    </div>
                    <Col sm={12} lg="4" className={`${isMenuOpen ? "d-flex" : "d-none"} d-md-block flex-column border position-relative bg-light z-2`}>
                        <div className="border">
                            <MenuCafe setSelectsMenu={setSelectsMenu} />
                        </div>
                    </Col>

                    <Col sm={12} lg="8">
                        <div className="border pt-4">
                            <ul>
                                {selectsMenu.map(e => (
                                    <Alert className="titleYekan responsive-text" variant="light" key={e.id} style={{ position: "relative" }}>
                                        <b>{e.name} - {e.count} عدد</b>
                                        <MdTextDecrease
                                            onClick={() => decreaseCountHandler(e.name)}
                                            style={{ position: "absolute", left: "45px", cursor: "pointer" }}
                                            className="border"
                                        />
                                        <IoCloseCircle
                                            onClick={() => removeItemHandler(e.name)}
                                            style={{ position: "absolute", left: "5px", cursor: "pointer" }}
                                        />
                                    </Alert>
                                ))}
                            </ul>

                            {totalPrice > 0 && (
                                <div className="border m-4">
                                    {/* نمایش تاریخ سفارش */}
                                    <p className="text-end mx-2 mt-2 text-muted responsive-text" style={{ fontSize: "0.9rem" }}>
                                        تاریخ ثبت: {todayNow}
                                    </p>

                                    {itemCalculator.map(item => (
                                        <Table striped="columns" key={item.id}  className="responsive-text">
                                            <thead>
                                                <tr>
                                                    <th>{item.id}</th>
                                                    <th>{item.name}</th>
                                                    <th>{item.count}</th>
                                                    <th>{item.price.toLocaleString()}</th>
                                                    <th>{item.totalPriceItem.toLocaleString()}</th>
                                                </tr>
                                            </thead>
                                        </Table>
                                    ))}

                                    <p className="mt-4 text-center">
                                        مجموع کل : <b>{totalPrice.toLocaleString()}</b> تومان
                                    </p>
                                    <Button className="m-2" onClick={addOrderOut}>ثبت</Button>
                                </div>
                            )}
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    );
}
