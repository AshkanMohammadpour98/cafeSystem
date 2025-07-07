import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";

export default function EdetItemMenu({ showItemEditPanel, setShowItemEditPanel, selectsMenu, setSelectsMenu, itemName }) {
  const [selectItem, setSelectItem] = useState({});
  const [isDisableButton, setIsDisableButton] = useState(true);
  const [catagorys , setCatagorys] = useState([])

  useEffect(()=>{
       axios
          .get("http://localhost:3001/catagory")
          .then((res) => setCatagorys(res.data.map(i => {
            return [...catagorys], i.name
          })))
          .catch((err) => console.log(err));
  } , [])
  useEffect(() => {
    const item = selectsMenu.find(element => element.name === itemName);
    if (item) {
      setSelectItem(item);
    }
  }, [itemName, selectsMenu]);

  const changeInput = (e) => {
    const { id, value } = e.target;
    setIsDisableButton(false);

    const updatedValue = id === "price" || id === "cost" ? Number(value) : value;
    setSelectItem(prev => ({ ...prev, [id]: updatedValue }));
    console.log(selectItem);
    
  };

  const handleEdit = async () => {
    console.log(selectItem);
    
    try {
      await axios.put(`http://localhost:3001/dataMenu/${selectsMenu[0].id}`, selectItem);

      setSelectsMenu(prevItems =>
        prevItems.map(item => item.id === selectItem.id ? selectItem : item)
      );

      Swal.fire({
        icon: "success",
        title: "ویرایش با موفقیت انجام شد",
        showConfirmButton: false,
        timer: 1500
      });

      setIsDisableButton(true);
      setShowItemEditPanel(false);
      setSelectItem({});
    } catch (err) {
      console.error("خطا در ویرایش آیتم:", err);
      Swal.fire({
        icon: "error",
        title: "خطا در ویرایش",
        text: "لطفاً دوباره تلاش کنید."
      });
    }
  };

  return (
    <div className="py-2">
      <h1 className="text-center">ویرایش آیتم</h1>

      <div className="row g-4 my-4">
        <form dir="rtl">
          <div className="col form-floating my-2">
            <input
              type="text"
              id="name"
              defaultValue={selectItem.name}
              onChange={changeInput}
              className="form-control"
              placeholder="nameItem"
              aria-label="nameItem"
            />
            <label htmlFor="name">نام</label>
          </div>

          <div className="col form-floating my-2">
            <input
              type="number"
              id="price"
              defaultValue={selectItem.price}
              onChange={changeInput}
              className="form-control"
              placeholder="priceItem"
              aria-label="priceItem"
            />
            <label htmlFor="price">قیمت فروش</label>
          </div>

          <div className="col form-floating my-2">
            <input
              type="number"
              id="cost"
              defaultValue={selectItem.cost}
              onChange={changeInput}
              className="form-control"
              placeholder="costItem"
              aria-label="costItem"
            />
            <label htmlFor="cost">قیمت پایه</label>
          </div>

          <div className="col form-floating my-2" id="catagory">
            <label htmlFor="catagory">دسته‌بندی</label>
            <select
              id="catagory"
              className="form-select"
              value={selectItem.catagory || ""}
              onChange={changeInput}
            >
              {catagorys.map((i, index) => (
                <option key={index} value={i}>{i}</option>
              ))}
            </select>
          </div>

          <Button className="my-2" disabled={isDisableButton} onClick={handleEdit}>
            ویرایش
          </Button>
        </form>
      </div>

      <Button variant="secondary" onClick={() => setShowItemEditPanel(false)}>
        بستن
      </Button>
    </div>
  );
}



