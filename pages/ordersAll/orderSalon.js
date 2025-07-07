import { useEffect, useState } from "react";
import { Container, Row, Col, Button, Alert, Table } from "react-bootstrap";
import { MdMenuBook, MdTextDecrease, MdKeyboardArrowDown } from "react-icons/md";
import { IoCloseCircle } from "react-icons/io5";
import MenuCafe from "@/components/menuCafe/menuCafe";
import axios from "axios";
import Swal from "sweetalert2";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

export default function OrderSalon() {
  const [selectsMenu, setSelectsMenu] = useState([]);
  const [itemCalculator, setItemCalculator] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [chaierName, setChaierName] = useState('');
  const [confirmedChairs, setConfirmedChairs] = useState([]);
  const [chaierContextMenuOrder, setChairContextMenuOrder] = useState({ state: false });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  useEffect(() => {
    const fetchConfirmedChairs = async () => {
      try {
        const res = await axios.get("http://localhost:3001/dataOrderSalonChair");
        const existingChairs = res.data.map(order => order.chaierName);
        setConfirmedChairs(existingChairs);
      } catch (err) {
        console.error("خطا در دریافت میزها از دیتابیس", err);
      }
    };
    fetchConfirmedChairs();
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      setChairContextMenuOrder({ state: false });
    };
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const removeItemHandler = (name) => {
    setSelectsMenu(prev => prev.filter(item => item.name !== name));
  };

  const decreaseCountHandler = (name) => {
    setSelectsMenu(prev =>
      prev.map(item =>
        item.name === name && item.count > 1 ? { ...item, count: item.count - 1 } : item
      ).filter(item => item.count > 0)
    );
  };

  const chairHandler = async (e) => {
    const selectedChair = e.target.innerText;
    setChaierName(selectedChair);

    try {
      const res = await axios.get("http://localhost:3001/dataOrderSalonChair");
      const existingOrder = res.data.find(order => order.chaierName === selectedChair);
      if (existingOrder && Array.isArray(existingOrder.itemCalculator)) {
        setSelectsMenu(existingOrder.itemCalculator);
      } else {
        setSelectsMenu([]);
      }
    } catch (err) {
      console.error("خطا در بررسی سفارش میز", err);
    }
  };

  const addOrderSalonChair = async () => {
    if (!chaierName) {
      Swal.fire({
        title: "شماره میز را انتخاب کنید",
        text: "قبل از ثبت سفارش سالن شماره میز را انتخاب کنین",
        icon: "warning"
      });
      return;
    }

    const today = new DateObject({ calendar: persian, locale: persian_fa });
    const todayNow = today.format("YYYY/MM/DD");

    try {
      const resSalon = await axios.get("http://localhost:3001/dataOrderSalonChair");
      const existingSalonOrder = resSalon.data.find(order => order.chaierName === chaierName);

      const orderData = {
        itemCalculator,
        totalPrice,
        chaierName,
        date: todayNow,
      };

      if (existingSalonOrder) {
        await axios.put(`http://localhost:3001/dataOrderSalonChair/${existingSalonOrder.id}`, orderData);
      } else {
        await axios.post("http://localhost:3001/dataOrderSalonChair", orderData);
      }

      if (!confirmedChairs.includes(chaierName)) {
        setConfirmedChairs(prev => [...prev, chaierName]);
      }

      Swal.fire({
        title: "سفارش ثبت شد",
        text: `سفارش  ${chaierName} با موفقیت ثبت شد`,
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });

      setSelectsMenu([]);
      setChaierName('');
    } catch (err) {
      console.error("خطا در ثبت یا ویرایش سفارش:", err);
    }
  };

  const settleOrderHandler = async () => {
    try {
      const res = await axios.get("http://localhost:3001/dataOrderSalonChair");
      const order = res.data.find(o => o.chaierName === chaierName);
      if (order) {
        await axios.post("http://localhost:3001/dataOrderOut", order);
        await axios.delete(`http://localhost:3001/dataOrderSalonChair/${order.id}`);
        Swal.fire("فاکتور تسویه شد", "", "success");
        setConfirmedChairs(prev => prev.filter(name => name !== chaierName));
        setSelectsMenu([]);
        setChaierName('');
        setChairContextMenuOrder({ state: false });
      }
    } catch (err) {
      console.error("خطا در تسویه فاکتور:", err);
    }
  };

  const chaierContextMenu = (e) => {
    e.preventDefault();
    const rect = e.target.getBoundingClientRect();
    setChairContextMenuOrder({
      state: true,
      top: `${rect.bottom + window.scrollY}px`,
      left: `${rect.left + window.scrollX}px`,
    });
  };

  return (
    <Container dir="rtl">
      <h1 className="text-center my-4">سفارشات سالن</h1>

      {chaierContextMenuOrder.state && (
        <Button
          onClick={settleOrderHandler}
          style={{
            position: 'absolute',
            top: chaierContextMenuOrder.top,
            left: chaierContextMenuOrder.left,
            zIndex: 1000,
          }}
        >
          تسویه فاکتور
        </Button>
      )}

      <Row>
        <div className="d-block d-md-none position-relative z-3 bg-white p-2 border" onClick={toggleMenu} style={{ cursor: "pointer" }}>
          <MdMenuBook /> منو
          <MdKeyboardArrowDown style={{ transition: "transform 0.3s", transform: isMenuOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
        </div>

        <Col xs={12} lg={4} className={`${isMenuOpen ? "d-flex" : "d-none"} d-md-block flex-column border position-relative bg-light z-2`}>
          <div className="border">
            <MenuCafe setSelectsMenu={setSelectsMenu} />
          </div>
          <div className="mt-4">
            <Container>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                <Button
                  key={num}
                  className="m-2"
                  onClick={chairHandler}
                  onContextMenu={chaierContextMenu}
                  variant={
                    confirmedChairs.includes(`میز${num}`) || chaierName === `میز${num}`
                      ? 'success'
                      : 'secondary'
                  }
                >
                  میز{num}
                </Button>
              ))}
            </Container>
          </div>
        </Col>

        <Col xs={12} lg={8}>
          <div className="border pt-4 responsive-text">
            <h3 className="text-center text-primary responsive-heading">{chaierName}</h3>
            <ul>
              {selectsMenu.map(e => (
                <Alert variant="light" key={e.id} style={{ position: "relative" }}>
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

            {totalPrice >= 1 && (
              <div className="border m-4 responsive-text">
                <p className="text-end mx-2 mt-2 text-muted" style={{ fontSize: "0.9rem" }}>
                  تاریخ ثبت: {new DateObject({ calendar: persian, locale: persian_fa }).format("YYYY/MM/DD")}
                </p>
                {itemCalculator.map(item => (
                  <Table striped="columns" key={item.id}>
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
                <p className="mt-4 text-center responsive-text">
                  مجموع کل : <b>{totalPrice.toLocaleString()}</b> تومان
                </p>
                <Button className="m-2" onClick={addOrderSalonChair}>ثبت</Button>
              </div>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}
