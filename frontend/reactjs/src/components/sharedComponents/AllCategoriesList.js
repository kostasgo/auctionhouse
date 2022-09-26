import React, { Component } from 'react'
import axios from 'axios'

export default class AllCategoriesList extends Component {

    constructor(props, context) {
        super(props);
        this.state = {
            categories_given : []
        };
    }

    componentDidMount() {
        axios.get("http://localhost:8080/api/v1/categories")
            .then(response => response.data)
            .then((data) => {
                this.setState({ categories_given : data});
            });
    }
    render() {
        return (

            this.state.categories_given.map((category) => (
                <option key={category.id} value={category.name}>{category.name}</option>
            ))
        )
    }
}