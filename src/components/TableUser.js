import Table from 'react-bootstrap/Table';
import { useEffect, useState } from 'react';
import { fetchAllUser } from '../services/UserService';
import ReactPaginate from 'react-paginate';
import ModalAddNew from './ModalAddNew';
import ModalEditUser from './ModalEditUser';
import _ from 'lodash';   // trỏ đến 2 địa chỉ bộ nhớ khác nhau
import ModalConfirm from './ModalConfirm';
import './TableUser.scss';
import { debounce } from 'lodash';

const TableUser = (props) => { 

const [listUsers , setListUsers ] = useState({});
const [totalUsers , setTotalUsers] = useState(0);  // muốn lấy gì trong api phải tạo biến để chứa cái đó
const [totalPages , setTotalPages] = useState(0); 
const [isShowModalAddNew, setIsShowModalAddNew] = useState(false);
const [isShowModalEdit , setIsShowModalEdit] = useState(false);
const [dataUserEdit , setDataUserEdit] = useState([]);
const [isShowModalDelete , setIsShowModalDelete] = useState(false);
const [dataUserDelete , setDataUserDelete] = useState({});

const [ sortBy , setSortBy ] = useState("asc");
const [ sortField , setSortField] = useState("id");

const [keyword , setKeyword] = useState("");

const handleClose = () => {
    setIsShowModalAddNew(false);
    setIsShowModalEdit(false);
    setIsShowModalDelete(false);
}

const handleUpdateTable = (user) => {
  setListUsers([user, ...listUsers]);
}

const handleEditUserFromModal = (user) =>{
    let cloneListUsers = _.cloneDeep(listUsers);
    let index = listUsers.findIndex(item => item.id === user.id);  // tìm chỉ số dựa theo id trong listUsers
    cloneListUsers[index].first_name = user.first_name;
    setListUsers(cloneListUsers);
}

useEffect(() => {
  getUsers(1);
},[])  

  const getUsers = async(page) => {
    let res = await fetchAllUser(page);
    if (res && res.data){
      setListUsers(res.data);  // chỉ lấy data thui 
      setTotalUsers(res.total); // chỉ lấy total
      setTotalPages(res.total_pages);
    }
  }

  const handlePageClick = (event) => {
    console.log("check event: " , event);  
       getUsers(+event.selected + 1);
  }

  const handleEditUser = (user) => {         // user là item
    setIsShowModalEdit(true);
    setDataUserEdit(user);
  }

  const handleDeleteUser = (user) => {
    setIsShowModalDelete(true);
    setDataUserDelete(user);
  }

  const handleDeleteUserFromModal = (user) => {
    let cloneListUsers = _.cloneDeep(listUsers);
    cloneListUsers = cloneListUsers.filter(item => item.id !== user.id) 
    setListUsers(cloneListUsers);
  }

    const handleSort = (sortBy, sortField) => {
      setSortBy(sortBy);
      setSortField(sortField);

      let cloneListUsers = _.cloneDeep(listUsers);
      cloneListUsers = _.orderBy(cloneListUsers, [sortField] , [sortBy] ); // hàm orderBy sắp xếp
      setListUsers(cloneListUsers);
      }

    const handleSearch = debounce((event) => {       // event.target.value là giá trị mình nhập vào
        let term = event.target.value;
        if (term){
          let cloneListUsers = _.cloneDeep(listUsers);
          cloneListUsers = cloneListUsers.filter(item => item.email.includes(term))
          setListUsers(cloneListUsers);  

        } else {
          getUsers(1);
        }
    },200);

    return(
        <> 
        <div className='my-3 add-new'>
          <span> <b>List Users</b></span>
              <button 
              className='btn btn-success'
              onClick={() => setIsShowModalAddNew(true)}
              >
                  Add new user
              </button>
          </div>
          <div className='col-6 my-3'>
              <input 
                  className='form-control' 
                  placeholder='Search user by email ....'
                  // value = {keyword}
                  onChange={(event) => handleSearch(event)}
              >
              </input>
          </div>
          
          <Table striped bordered hover>
            <thead>
              <tr>
                <th >
                  <div className='sort-header'>
                      <span>ID</span> 
                      <span>
                          <i 
                          className="fa-solid fa-arrow-down-long"
                          onClick = {() => handleSort("desc" ,"id")}
                          >
                          </i>
                          <i 
                            className="fa-solid fa-arrow-up-long"
                            onClick = {() => handleSort("asc" ,"id")}
                          ></i>
                      </span>
                  </div>
       
                </th>
                <th>Email</th>
                <th>
                <div className='sort-header'>
                    <span>First Name</span> 
                    <span>
                          <i 
                          className="fa-solid fa-arrow-down-long"
                          onClick = {() => handleSort("desc" ,"first_name")}
                          >
                          </i>
                          <i 
                            className="fa-solid fa-arrow-up-long"
                            onClick = {() => handleSort("asc" ,"first_name")}
                          ></i>
                      </span>
                </div>
                  </th>
                <th>Last Name</th>
                <th >Action</th>

              </tr>
            </thead>
            <tbody>
              {listUsers && listUsers.length > 0 && listUsers.map((item, index) => {
                  return (
                    <tr key={`user-${index}`} >  
                     {/* user là chuỗi text ko phải biến index */}
                        <td>{item.id}</td>
                        <td>{item.email}</td>
                        <td>{item.first_name}</td>
                        <td>{item.last_name}</td>

                        <td>
                            <button 
                              className='btn btn-warning mx-3'
                              onClick={() => handleEditUser(item)}
                              >
                                Edit
                                </button>
                            <button 
                            className='btn btn-danger'
                            onClick={() => handleDeleteUser(item)}
                            >Delete</button>
                        </td>
                    </tr>
                  )
              })}
              <tr>
       
              </tr>
            </tbody>
          </Table>
          <ReactPaginate
              breakLabel="..."
              nextLabel="next >"
              onPageChange={handlePageClick}
              pageRangeDisplayed={5}
              pageCount={totalPages}
              pageClassName='page-item'
              pageLinkClassName="page-link"
              previousLinkClassName="page-link"
              previousClassName='page-item'
              nextClassName='page-item'
              nextLinkClassName="page-link"
              breakClassName='page-item'
              breakLinkClassName='page-link'
              containerClassName="pagination"
              previousLabel="< previous"
              activeClassName="active" 
          />
               <ModalAddNew
                    show = {isShowModalAddNew}
                    handleClose = {handleClose}
                    handleUpdateTable = {handleUpdateTable}
                />
                <ModalEditUser
                  show = {isShowModalEdit}
                  dataUserEdit = {dataUserEdit}
                  handleClose = {handleClose}
                  handleEditUserFromModal = {handleEditUserFromModal}
                />
                
                <ModalConfirm
                  show = {isShowModalDelete}
                  handleClose = {handleClose}
                  dataUserDelete = {dataUserDelete}
                  handleDeleteUserFromModal = {handleDeleteUserFromModal}
                />

        </>
    )
}

export default TableUser