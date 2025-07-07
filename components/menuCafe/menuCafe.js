import { useEffect, useState } from "react";
import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import style from '@/components/menuCafe/menuCafe.module.css'
import axios from "axios";

export default function MenuCafe({ setSelectsMenu }) {
  const [show, setShow] = useState(false);
  const [itemTitle, setItemTitle] = useState("");
  const [dbMenu, setDbMenu] = useState([]);
  const [selectItem, setSelectItem] = useState([]);
  const [catagorys, setCatagorys] = useState([])

  useEffect(() => {
    fetch('/database/db.json')
      .then(res => res.json())
      .then(data => setDbMenu(data.dataMenu))
      .catch(err => console.error("خطا در خواندن منو:", err));

    axios
      .get("http://localhost:3001/catagory")
      .then((res) => setCatagorys(res.data.map(i => {
        return [...catagorys], i.name
      })))
      .catch((err) => console.log(err));
  }, []);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const itemHandler = (e) => {
    const category = e.target.innerText;
    setItemTitle(category);
    handleShow();
    const filteredItems = dbMenu.filter(item => item.catagory === category);
    setSelectItem(filteredItems);
  };

  const clickSelectItem = (e) => {
    const name = e.target.innerText;
    const selectedItem = selectItem.find(item => item.name === name);
    if (!selectedItem) return;

    setSelectsMenu(prev => {
      const existingItem = prev.find(item => item.name === name);
      if (!existingItem) {
        return [...prev, { ...selectedItem, count: 1 }];
      } else {
        return prev.map(item =>
          item.name === name ? { ...item, count: item.count + 1 } : item
        );
      }
    });
  };

  return (
    <>
        <Container className="mt-4">
        <Modal dialogClassName={style.modaldialogright} show={show} onHide={handleClose} backdrop="static" keyboard={false}>
          <Modal.Header closeButton>
            <Modal.Title className="titleYekan fs-5 fs-md-4 fs-lg-3 text-primary">{itemTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ul>
              {selectItem.map((e) => (
                <Button
                  variant="secondary"
                  className="mx-1 my-1 fs-6 fs-md-5 fs-lg-4 p-2 p-md-3 p-lg-4"
                  key={e.id}
                  onClick={clickSelectItem}
                  title={e.price}
                >
                  {e.name}
                </Button>
              ))}
            </ul>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" className="fs-6 fs-md-5 fs-lg-4 " onClick={handleClose}>بستن</Button>
          </Modal.Footer>
        </Modal>

        <Row>
          {catagorys.map((title, index) => (
            <Col key={index} xs={12} sm={12} md={6} lg={4} className="p-2">
              <Button className="w-100 fs-6 fs-md-5 fs-lg-4" onClick={itemHandler}>
                {title}
              </Button>
            </Col>
          ))}
        </Row>

      </Container>
    </>
  );
}
