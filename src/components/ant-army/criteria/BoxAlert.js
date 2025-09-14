import { Button, Modal, ModalBody, ModalFooter} from "reactstrap"

export const BoxLoading = ({ open, setOpen }) => {
    return (
        <Modal isOpen={open} toggle={() => setOpen(false)} centered>
            <ModalBody>
                <div className="loader-box">
                    <div className="loader-30"></div>
                </div>
            </ModalBody>   
        </Modal>
    )
}

export const BoxError = ({ open, setOpen, text = 'เกิดข้อผิดพลาด ไม่สามารถบันทึกข้อมูลได้' }) => {
    return (
        <Modal isOpen={open} toggle={() => setOpen(false)} centered>
            <ModalBody style={{ paddingTop: '30px', paddingBottom: '20px' }}>
               <h5>{text}</h5>
            </ModalBody> 
            <ModalFooter>
                <Button color="secondary" onClick={() => setOpen(false)}>ปิด</Button>
            </ModalFooter>  
        </Modal>
    )
}

export const BoxSuccess = ({ open, setOpen }) => {
    return (
        <Modal isOpen={open} toggle={setOpen} centered>
            <ModalBody style={{ paddingTop: '30px', paddingBottom: '20px' }}>
               <h5>บันทึกสำเร็จ</h5>
            </ModalBody> 
            <ModalFooter>
                <Button color="primary" onClick={setOpen}>ปิด</Button>
            </ModalFooter>  
        </Modal>
    )
}



