import React, { Component } from 'react';
import { Alert,
         Button,
         Modal,
         ModalHeader,
         ModalBody,
         Form, 
         FormGroup, 
         Label, 
         Input, 
         Col, 
         FormFeedback } from 'reactstrap';

import {create} from '../api/api-trans';
import {read} from '../api/api-entities';

class AddTransaction extends Component {

    constructor(props) {
        super(props);

        this.state = {
            amount:'',
            type:'',
            mode:'',
            remark:'',
            status:'',
            error:'',
            open:'',
            entityId:'',
            entities:[],
            touched: {
                amount: false,
                type: false,
                mode: false,
                remark: false,
                status: false,
            }
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.toggleModal=this.toggleModal.bind(this);
        this.handleEntityChange=this.handleEntityChange.bind(this);
    }

    componentDidMount()
    {
        const token=localStorage.getItem('jwtToken');
        read(token).then((data) => {
            console.log(data);
            
            if (data.errors) {
                this.setState({ ...this.state,error:data.errors[0].msg})
            } else {
                this.setState({
                   entities:data,
                   entityId:data[0]._id
                })
            }
            console.log(this.state);
        })
    }

    toggleModal() {
      
        this.setState({
          open: !this.state.open
        });
      }

    onRadioChange = (e) => {
       
        this.setState({
          type: e.target.value
        });
    }

    onRadioModeChange = (e) => {
        
        this.setState({
          mode: e.target.value
        });
    }

    onRadioStatusChange = (e) => {
        
        this.setState({
          status: e.target.value
        });
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({ [name]: value })
    }

    handleEntityChange(e) {

        this.setState({entityId:e.target.value});
        
    }

    handleSubmit(event) {
       
        const transaction={
            "amount":this.state.amount,
            "transactionType":this.state.type,
            "transactionMode":this.state.mode,
            "transactionStatus":this.state.status,
            "remark":this.state.remark,
            "entityId":this.state.entityId
        }

        event.preventDefault();
        const token=localStorage.getItem('jwtToken');

        create(transaction,token).then((data) => {
           
            if (data.errors) {
              this.setState({ ...this.state, error: data.errors[0].msg})
            } else {
              this.setState({ ...this.state, error:'',open:true})
            }
        })
        
    }

    handleBlur = (field) => (evt) => {
        this.setState({
            touched: { ...this.state.touched, [field]: true}
        });
    }

    validate(amount,type,mode,remark,status) {
        const errors = {
            amount:'',
            type:'',
            mode:'',
            remark:'',
            status:''
        };

        if (this.state.touched.remark && remark.length < 3)
            errors.remark = 'Remark should be greater than 3 characters';
        else if (this.state.touched.remark && remark.length > 25)
            errors.remark = 'Remark should be less than 25 characters';

        const reg = /^\d+$/;

        if (this.state.touched.amount && !reg.test(amount))
            errors.amount = 'amount should contain only numbers';

        return errors;
    };

    render() {
        const errors = this.validate(this.state.amount, this.state.type, this.state.mode,this.state.remark,this.state.status);


        return (
            <div className="container">
                <div className="row row-content">
                    <div className="col-12 col-md-9">
                    
                        { 
                            this.state.error && <Alert color="danger">
                                {this.state.error}
                            </Alert>
                        }

                        <Form onSubmit={this.handleSubmit}>
                            <FormGroup row>
                                <Label htmlFor="amount" md={2}>Amount</Label>
                                <Col md={10}>
                                    <Input type="number" id="amount" name="amount" placeholder="Amount" value={this.state.amount} valid={errors.amount === ''} invalid={errors.amount !== ''} onChange={this.handleInputChange} onBlur={this.handleBlur('amount')} />
                                    <FormFeedback>{errors.contactNo}</FormFeedback>
                                </Col>
                            </FormGroup>


                            <FormGroup row>
                                <Col md={2} >
                                    <p>Type </p>
                                </Col>
                                <Col md={2} className="ml-3 mr-0">
                                    <Label>
                                        <Input
                                        type="radio"
                                        value="credit"
                                        checked={this.state.type === "credit"}
                                        onChange={this.onRadioChange}
                                        />
                                        <span>Credit</span>
                                    </Label>
                                </Col>
                                <Col >
                                    <Label>
                                        <Input
                                        type="radio"
                                        value="debit"
                                        checked={this.state.type === "debit"}
                                        onChange={this.onRadioChange}
                                        />
                                        <span>Debit</span>
                                    </Label>
                                </Col>
                            </FormGroup>

                            <FormGroup row>
                                <Col md={2} >
                                    <p>Status </p>
                                </Col>
                                <Col md={2} className="ml-3 mr-0">
                                    <Label>
                                        <Input
                                        type="radio"
                                        value="pending"
                                        checked={this.state.status === "pending"}
                                        onChange={this.onRadioStatusChange}
                                        />
                                        <span>Pending</span>
                                    </Label>
                                </Col>
                                <Col >
                                    <Label>
                                        <Input
                                        type="radio"
                                        value="paid"
                                        checked={this.state.status === "paid"}
                                        onChange={this.onRadioStatusChange}
                                        />
                                        <span>Completed</span>
                                    </Label>
                                </Col>
                            </FormGroup>


                            <FormGroup row>
                                <Col md={2} >
                                    <p>Mode </p>
                                </Col>
                                <Col md={2} className="ml-3 mr-0">
                                    <Label>
                                        <Input
                                        type="radio"
                                        value="cash"
                                        checked={this.state.mode === "cash"}
                                        onChange={this.onRadioModeChange}
                                        />
                                        <span>Cash</span>
                                    </Label>
                                </Col>
                                <Col md={2} className="ml-0 mr-0">
                                    <Label>
                                        <Input
                                        type="radio"
                                        value="upi"
                                        checked={this.state.mode === "upi"}
                                        onChange={this.onRadioModeChange}
                                        />
                                        <span>UPI</span>
                                    </Label>
                                </Col>
                                <Col md={2} className="ml-3 mr-0">
                                    <Label>
                                        <Input
                                        type="radio"
                                        value="debit-card"
                                        checked={this.state.mode === "debit-card"}
                                        onChange={this.onRadioModeChange}
                                        />
                                        <span>Debit Card</span>
                                    </Label>
                                </Col>
                                <Col >
                                    <Label>
                                        <Input
                                        type="radio"
                                        value="credit-card"
                                        checked={this.state.mode === "credit-card"}
                                        onChange={this.onRadioModeChange}
                                        />
                                        <span>Credit Card</span>
                                    </Label>
                                </Col>
                            </FormGroup>

                            <FormGroup row>
                                <Label htmlFor="enitityId" md={2}>Entitiy</Label>
                                <Col md={10}>
                                    <Input type="select" name="entityId" id="entityId" value={this.state.entityId} onChange={this.handleEntityChange}>
                                    (
                                        {this.state.entities.map(entity=>(<option value={entity._id}  >{entity.name} :  {entity.address} : {entity.contactNo}</option>))}
                                    )
                                    </Input>
                                </Col>
                            </FormGroup>

                            <FormGroup row>
                                <Label htmlFor="remark" md={2}>Remarks</Label>
                                <Col md={10}>
                                    <Input type="text" id="remark" name="remark" placeholder="Remark" value={this.state.remark} valid={errors.remark === ''} invalid={errors.remark !== ''} onChange={this.handleInputChange} onBlur={this.handleBlur('remark')} />
                                    <FormFeedback>{errors.remark}</FormFeedback>
                                </Col>
                            </FormGroup>

                            

                            <FormGroup row>
                                <Col md={{ size: 10, offset: 2 }}>
                                    <Button type="submit" color="primary">ADD</Button>
                                </Col>
                            </FormGroup>

                            
                        </Form>
                    </div>
                </div>
                <Modal isOpen={this.state.open} toggle={this.toggleModal}>
                <ModalHeader toggle={this.toggleModal}>Transaction</ModalHeader>
                <ModalBody>
                    You have successfully added the Transaction!
                </ModalBody>
                </Modal>
            </div>
        );
    };
}

export default AddTransaction;