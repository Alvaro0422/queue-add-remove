import { WithDefaultLayout } from "@/components/DefautLayout";
import queueListAtom from "@/data/queue";
import { Page } from "@/types/Page";
import { ColumnType } from "antd/es/table";
import { Alert, Button, Col, Input, Row, Space, Table } from "antd";
import { useAtom } from "jotai";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import CreateQueueForm from "@/types/CreateQueueForm";
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateQueueFormSchema } from "@/schemas/CreateQueueSchema";

interface CreateQueueFormData{
    name: string;
    row: number;
}

interface queueTableData{
    value1?: string;
    value2?: string;
    value3?: string;
}

const queue: Page = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [queue, setQueue] = useAtom(queueListAtom);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isFailedAlertVisible, setIsFailedAlertVisible] = useState(false);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { handleSubmit, control, formState: {errors}, reset} = useForm<CreateQueueForm>({
        resolver: zodResolver(CreateQueueFormSchema),
        mode: 'onChange'
    })

    const value1 = queue.filter(item => item.row===1).map(item => item.name)
    const value2 = queue.filter(item => item.row===2).map(item => item.name)
    const value3 = queue.filter(item => item.row===3).map(item => item.name)

    const maxRows = Math.max(value1.length, value2.length, value3.length);

    const data: {value1?: string, value2?: string, value3?: string}[] = [];
    for (let i = 0; i < maxRows; i++) {
        if(i<3){
            const rowData = {
                value1: value1[i],
                value2: value2[i],
                value3: value3[i]
              };
              data.push(rowData);
        }else{
            const rowData = {
                value1: value1.length<=3?'':`${value1.length-3} people in line`,
                value2: value2.length<=3?'':`${value2.length-3} people in line`,
                value3: value3.length<=3?'':`${value3.length-3} people in line`,
            };
            data.push(rowData);
            break;
        }
        
    }

    //   console.log(value2)

    // const filteredDataSource = queue.filter(item => [1].includes(item.row));

    const queueColumns: ColumnType<queueTableData>[] = [
        // {title: 'name', dataIndex: 'name', render: (text: string) => text},
        {title: 'Cashier #1', dataIndex: 'value1', key: 'value1'},
        {title: 'Cashier #2', dataIndex: 'value2', key: 'value2'},
        {title: 'Cashier #3', dataIndex: 'value3', key: 'value3'}
    ]

    function onFormSubmit(formData: CreateQueueFormData){
        // console.log(Math.floor(Math.random()*3 + 1))
        // alert(`Name: ${formData.name}\nRow: ${formData.row}`)
        const temp = queue.filter(p => p.name.toLocaleLowerCase() === formData.name.toLocaleLowerCase())
        console.log(temp)
        if(temp.length === 0){
            setQueue([...queue, {
                name: formData.name,
                row: Math.floor(Math.random()*3 + 1)
            }]);

            setIsFailedAlertVisible(false)
            setIsAlertVisible(true)
            reset();
        }else{
            setIsAlertVisible(false)
            setIsFailedAlertVisible(true)
            return;
        } 
    }

    function onClickDeleteCashier(singularQueue: number){
        const temp = queue.filter(p => p.row === singularQueue)
        const tempName = queue.filter(p => p.name !== temp[0]?.name)

        setQueue(tempName)
        // console.log(tempName)
    }

    return (<>
        <Row>
            <Col span={24}>
                <h1>Queue</h1>
            </Col>
        </Row>
        <Row>
            <Col span={24}>
                <Table dataSource={data} columns={queueColumns} />
            </Col>
        </Row>
        {isAlertVisible && 
        <Row>
            <Col>
                <Alert 
                message='Successfully entered to queue!'
                type="success"
                closable
                onClose={() => setIsAlertVisible(false)}/>
            </Col>
        </Row>}
        {isFailedAlertVisible && 
        <Row>
            <Col>
                <Alert 
                message='Name already exist!'
                type="error"
                closable
                onClose={() => setIsAlertVisible(false)}/>
            </Col>
        </Row>}
        <Space direction="vertical" size={'middle'} style={{display: 'flex'}}>
            <Row>
                <Col span={24}>
                    <form onSubmit={handleSubmit(onFormSubmit)}>
                        <Space direction="horizontal" size={"middle"} style={{display: 'flex'}}>
                            <Row>
                                <Col span={20}>
                                    <Controller name="name"
                                    control={control}
                                    render={({field}) => <Input placeholder="name"
                                    addonBefore='Name' {...field}/>}/>

                                    {errors.name && <span className="text-red-500">{errors.name.message}</span>}
                                </Col>
                                <Button type="primary" htmlType="submit" className="bg-blue-500">Enter Queue</Button>   
                            </Row>

                            <Row>
                                <Col span={12}>
                                    <Button onClick={() => onClickDeleteCashier(1)} className="bg-red-500">Handle Cashier #1</Button>
                                    <Button onClick={() => onClickDeleteCashier(2)} className="bg-red-500">Handle Cashier #2</Button>
                                    <Button onClick={() => onClickDeleteCashier(3)} className="bg-red-500">Handle Cashier #3</Button> 
                                </Col>
                            </Row>

                        </Space>
                    </form>
                </Col>
            </Row>
        </Space>
    </>
    )
}

queue.layout = WithDefaultLayout;
export default queue;