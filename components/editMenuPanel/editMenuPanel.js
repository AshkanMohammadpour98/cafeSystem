import axios from "axios";
import { useEffect, useState } from "react";
import EdetItemMenu from "./editItemMenu";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import Swal from "sweetalert2";
import { Container, Table, Button, Modal } from "react-bootstrap";

export default function EditMenuPanel({ setSelectsMenu, selectsMenu }) {
  const [menuDb, setMenuDb] = useState([]);
  const [showItemEditPanel, setShowItemEditPanel] = useState(false);
  const [showTitleItemPanel, setShowItemTitlePanel] = useState(false);
  const [itemName, setItemName] = useState("");
  const [showAddItem, setShowAddItem] = useState(false);
  const [addItemCatagory, setAddItemCatagory] = useState({});
  const [catagorys, setCatagorys] = useState([]);
  const [idSelectCatagorys, setIdSelectCatagorys] = useState(null)

  useEffect(() => {
    fetchMenuDb();
    fetchCatagoryDb();
  }, []);

  useEffect(() => {
    fetchMenuDb();
    fetchCatagoryDb();
  }, [menuDb]);
  const fetchMenuDb = () => {
    axios
      .get("http://localhost:3001/dataMenu")
      .then((res) => setMenuDb(res.data))
      .catch((err) => console.log(err));
  };

  const fetchCatagoryDb = () => {
    axios
      .get("http://localhost:3001/catagory")
      .then((res) => {
        // فرض می‌کنیم res.data آرایه از آبجکت‌هاست که هرکدام نام دسته بندی در فیلد name دارند
        const categories = res.data.map((i) => i.name);
        setCatagorys(categories);
      })
      .catch((err) => console.log(err));
  };

  const titleHandler = (e) => {
    const selected = e.target.innerHTML;
    const filteredItems = menuDb.filter((item) => item.catagory === selected);
    setSelectsMenu(filteredItems);
    setShowItemTitlePanel(true);
  };

  const handleClose = () => setShowAddItem(false);

  const chaneInputAddItem = (e) => {
    const { id, value } = e.target;
    setAddItemCatagory((prev) => {
      const updated = {
        ...prev,
        [id]: id === "price" || id === "cost" ? Number(value) : value,
      };

      // اگر دسته‌بندی انتخاب نشده و selectsMenu غیر خالیه، دسته‌بندی پیش‌فرض رو بزار
      if (!updated.catagory && selectsMenu.length > 0) {
        updated.catagory = selectsMenu[0].catagory;
      }

      return updated;
    });
  };

  const addNewItemCatagory = () => {
    // چک اولیه اگر addItemCatagory نام نداشت ارور بزن
    if (!addItemCatagory.name || !addItemCatagory.catagory) {
      Swal.fire({
        icon: "error",
        title: "خطا",
        text: "لطفاً نام و دسته‌بندی را وارد کنید.",
      });
      return;
    }

    axios
      .post("http://localhost:3001/dataMenu", addItemCatagory)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "ایتم با موفقیت اضافه شد",
          showConfirmButton: false,
          timer: 1500,
        });
        // console.log(addItemCatagory);
        // console.log("ID:", selectItem.id);
        // console.log("Item:", selectItem);

        fetchMenuDb();
        setSelectsMenu((prev) => [...prev, addItemCatagory]);
        setShowAddItem(false);
        setAddItemCatagory({});
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          icon: "error",
          title: "خطا در افزودن ایتم",
          text: "لطفاً دوباره تلاش کنید.",
        });
      });
  };

  const deleteItem = (id, name) => {
    Swal.fire({
      title: "حذف",
      text: "مطمئنی میخوای این ایتم رو حذف کنی؟",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "بستن",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "بله حذف شود",
    }).then((result) => {
      if (result.isConfirmed) {
        axios.get("http://localhost:3001/dataMenu").then((res) => {
          const matched = res.data.find((item) => item.id == id);
          if (!matched) {
            Swal.fire("خطا", "آیتم پیدا نشد", "error");
            return;
          }
          axios
            .delete(`http://localhost:3001/dataMenu/${matched.id}`)
            .then(() => {
              Swal.fire("حذف شد!", `${name} با موفقیت حذف شد`, "success");
              fetchMenuDb();
              setSelectsMenu((prev) => prev.filter((item) => item.id != matched.id));
            })
            .catch((err) => console.log(err));
        });
      }
    });
  };

  return (
    <Container className="mt-4">
      {showTitleItemPanel ? (
        <div style={{ display: showItemEditPanel ? "none" : "block" }}>
          <h1 className="text-center">آیتم‌های منو</h1>
          <b>تعداد آیتم‌های این دسته‌بندی : {selectsMenu.length}</b>
          <Table striped bordered hover dir="rtl">
            <thead>
              <tr>
                <th>نام محصول</th>
                <th>دسته‌بندی</th>
                <th>قیمت (فروش)</th>
                <th>قیمت (پایه)</th>
                <th>#</th>
              </tr>
            </thead>
            <tbody>
              {selectsMenu.length > 0 ? (
                selectsMenu.map((e) => (
                  <tr key={e.id}>
                    <td>{e.name}</td>
                    <td>{e.catagory}</td>
                    <td>{e.price.toLocaleString()}</td>
                    <td>{e.cost.toLocaleString()}</td>
                    <td>
                      <Button
                        name={e.name}
                        onClick={(ev) => {
                          setShowItemEditPanel(true);
                          setItemName(ev.target.name);
                        }}
                      >
                        ویرایش
                      </Button>{" "}
                      <Button
                        variant="danger"
                        onClick={() => deleteItem(e.id, e.name)}
                      >
                        حذف
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center">
                    این دسته‌بندی بدون زیرمنو است.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          <div className="d-flex justify-content-between mb-2">
            <Button onClick={() => setShowItemTitlePanel(false)}>بستن</Button>
            <Button
              className="rounded-circle"
              title="افزودن زیر منو به این دسته بندی"
              onClick={() => setShowAddItem(true)}
            // disabled={selectsMenu.length === 0} // اگر هیچ زیرمنویی نیست، غیر فعالش کن
            >
              <MdOutlinePlaylistAdd />
            </Button>
          </div>

          {/* Modal افزودن ایتم */}
          <Modal
            backdrop="static"
            show={showAddItem}
            onHide={handleClose}
            keyboard={false}

          >
            <Modal.Header closeButton>
              <Modal.Title className="titleYekan text-primary">
                {`افزودن آیتم به دسته بندی ${selectsMenu.length > 0 ? selectsMenu[0].catagory : "..."
                  }`}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form dir="rtl">
                <div className="col form-floating my-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="nameItem"
                    id="name"
                    onChange={chaneInputAddItem}
                  />
                  <label htmlFor="name">نام</label>
                </div>
                <div className="col form-floating my-2">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="costItem"
                    id="cost"
                    onChange={chaneInputAddItem}
                  />
                  <label htmlFor="cost">قیمت پایه</label>
                </div>
                <div className="col form-floating my-2">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="priceItem"
                    id="price"
                    onChange={chaneInputAddItem}
                  />
                  <label htmlFor="price">قیمت فروش</label>
                </div>
                <div className="col form-floating my-2" id="catagoryl">
                  <label htmlFor="catagoryl">دسته بندی</label>
                  <select
                    className="form-select"
                    id="catagory"
                    value={addItemCatagory.catagory || (selectsMenu.length > 0 ? selectsMenu[0].catagory : "")}
                    onChange={chaneInputAddItem}
                  >
                    {selectsMenu.length > 0 && (
                      <option value={selectsMenu[0].catagory}>
                        {selectsMenu[0].catagory}
                      </option>
                    )}
                    {catagorys
                      .filter(
                        (i) =>
                          selectsMenu.length === 0 || i !== selectsMenu[0].catagory
                      )
                      .map((i, index) => (
                        <option key={index} value={i}>
                          {i}
                        </option>
                      ))}
                  </select>
                </div>
                <Button type="button" onClick={addNewItemCatagory} className="mt-2">
                  افزودن آیتم جدید
                </Button>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                بستن
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      ) : (
        <Table striped bordered hover dir="rtl">
          <thead>
            <tr>
              <th>#</th>
              <th>نام دسته بندی</th>
              <th>تعداد آیتم‌ها</th>
            </tr>
          </thead>
          <tbody>
            {catagorys.length > 0 ? (
              catagorys.map((category, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td
                    style={{ cursor: "pointer" }}
                    onClick={titleHandler}
                  >
                    {category}
                  </td>
                  <td className="d-lg-flex d-lg-align-items-center justify-content-lg-between text-center">
                    <span className="responsive-text">{menuDb.filter((item) => item.catagory === category).length}</span>
                    <Button className="responsive-text" variant="danger" onClick={async () => {
                      try {
                        // 1. گرفتن id دسته‌بندی
                        const res = await axios.get("http://localhost:3001/catagory");
                        const targetCat = res.data.find(item => item.name === category);
                        if (!targetCat) return Swal.fire("خطا", "دسته‌بندی پیدا نشد", "error");

                        const catagoryId = targetCat.id;

                        // 2. حذف دسته‌بندی از catagory
                        await axios.delete(`http://localhost:3001/catagory/${catagoryId}`);

                        // 3. گرفتن لیست آیتم‌هایی که باید حذف بشن
                        const menuRes = await axios.get("http://localhost:3001/dataMenu");
                        const itemsToDelete = menuRes.data.filter(item => item.catagory === category);

                        // 4. حذف تکی آیتم‌ها از dataMenu
                        await Promise.all(
                          itemsToDelete.map(item =>
                            axios.delete(`http://localhost:3001/dataMenu/${item.id}`)
                          )
                        );

                        Swal.fire("موفق", `دسته‌بندی "${category}" و آیتم‌هایش حذف شدند`, "success");

                        // 5. رفرش دیتای صفحه
                        fetchMenuDb();
                        fetchCatagoryDb();
                        setSelectsMenu([]); // اگر دسته‌بندی انتخاب شده باشه
                      } catch (err) {
                        console.log(err);
                        Swal.fire("خطا", "مشکلی در حذف دسته‌بندی یا آیتم‌ها پیش آمد", "error");
                      }
                    }}>
                      حذف دسته‌بندی
                    </Button>

                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center">
                  هیچ دسته‌بندی‌ای موجود نیست.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      {/* کامپوننت ویرایش آیتم */}
      {showItemEditPanel && (
        <EdetItemMenu
          setShowItemEditPanel={setShowItemEditPanel}
          itemName={itemName}
          fetchMenuDb={fetchMenuDb}
          setSelectsMenu={setSelectsMenu}
          selectsMenu={selectsMenu}
        />
      )}
    </Container>
  );
}
