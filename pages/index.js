import styles from "@/styles/Home.module.css";
import { Col, Card, Container, Image, Row, Nav } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [activeKey, setActiveKey] = useState(""); // انتخاب‌شده
  const [catagorys, setCatagorys] = useState([]); // دسته‌بندی‌ها
  const [allDataItems, setAllDataItems] = useState([]); // همه آیتم‌ها

  useEffect(() => {
    axios.get("http://localhost:3001/dataMenu")
      .then(res => setAllDataItems(res.data))
      .catch(err => console.error(err));

    axios.get("http://localhost:3001/catagory")
      .then(res => {
        const names = res.data.map(i => i.name);
        setCatagorys(names);
        setActiveKey(names[0]); // اولین دسته‌بندی رو پیش‌فرض انتخاب کن
      })
      .catch(err => console.log(err));
  }, []);

  // فیلتر آیتم‌های مربوط به دسته‌بندی انتخاب‌شده
  const filteredItems = allDataItems.filter(item => item.catagory === activeKey);

  return (
    <>
      {/* ---------- منو ---------- */}
      <Container className="my-4">
        <Card>
          <Card.Header>
            <Nav
              variant="pills"
              activeKey={activeKey}
              onSelect={(selectedKey) => setActiveKey(selectedKey)}
              className="flex-wrap justify-content-center gap-2"
            >
              {catagorys.map(catagory => (
                <Nav.Item key={catagory}>
                  <Nav.Link eventKey={catagory}>{catagory}</Nav.Link>
                </Nav.Item>
              ))}
            </Nav>
          </Card.Header>

          <Card.Body className="text-center" style={{ backgroundColor: '#e7be99' }}>

            {/* نمایش آیتم‌های مربوط به دسته انتخاب‌شده */}
            {filteredItems.length > 0 ? (
              <Row className="g-3" >
                {<p>{filteredItems.length}  محصول</p>}
                {filteredItems.map(item => (
                  <Col md={6} xs={12} key={item.id}>
                    <Card className="h-100 p-2 " style={{ backgroundColor: '#e7be99', boxShadow: 'none', border: 'none' }}>
                      <Card.Body className="p-2">
                        <div className="d-flex align-items-center">
                          <span className="fw-bold text-end text-dark responsive-text">{item.name}</span>

                          {/* خط‌چین بین نام و قیمت */}
                          <div
                            className="flex-grow-1 mx-2"
                            style={{
                              borderBottom: '1px dashed #555',
                              height: '1px',
                            }}
                          ></div>

                          <span className="text-muted responsive-text">{item.price.toLocaleString()} تومان</span>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
                
              </Row>
            ) : (
              <p className="text-muted responsive-text">محصولی در این دسته‌بندی موجود نیست.</p>
            )}
          </Card.Body>
        </Card>
      </Container>

      <Container className="d-flex justify-content-center vh-80 ">
        <Row className="align-items-center">
          <Col md={6} xs={12}>
            <Image src={'../img/pacat.png'} style={{ maxWidth: '100%' }} />
          </Col>
          <Col md={6} xs={12} className="d-flex justify-content-center align-items-center">
            <p className="text-end">
              ☕ کافه مانگ جایی‌ست برای
              آرامش، گفتگو و لذت بردن از طعم واقعی قهوه. ما در قلب شهر با فضایی گرم و صمیمی میزبان شما
              هستیم تا با نوشیدنی‌های خاص، دسرهای خانگی و موسیقی دل‌نشین، لحظاتی متفاوت را تجربه کنید.
              هر روز با عشق قهوه می‌سازیم و با لبخند پذیرای حضور شما هستیم.   </p>
          </Col>
        </Row>
      </Container>

    </>
  );
}
