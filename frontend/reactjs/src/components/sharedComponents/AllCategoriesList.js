import React, { Component } from 'react'
import axios from 'axios'

export default class AllCategoriesList extends Component {

    constructor(props, context) {
        super(props);
        this.state = {
            categories : []
        };
    }

    componentDidMount() {
        axios.get("http://localhost:8080/api/v1/categories")
            .then(response => response.data)
            .then((data) => {
                this.setState({ categories : data});               
            });
    }
    render() {
        return (

            this.state.categories.map((category) => (
                <option value={category.name}>{category.name}</option>
            ))
        )
    }
}