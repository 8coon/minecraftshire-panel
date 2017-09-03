import React, {Component} from 'react';
import './filters.css';

// UI-Blocks
import FiltersControl from '../filters-control/filters-control';
import Input from '../input/input';


export default class Filters extends Component {

    static defaultProps = {
        filters: {favorite: false, online: false, query: ''},
        onChange: () => {},
    };

    constructor(props) {
        super(props);

        this.onFilterChange = this.onFilterChange.bind(this);
        this.onQueryChange = this.onQueryChange.bind(this);
    }

    onFilterChange(filters) {
        this.props.onChange({...this.props.filters, ...filters});
    }

    onQueryChange(evt) {
        this.props.onChange({...this.props.filters, query: evt.target.value});
    }

    render() {
        return (
            <div className="filters">
                <Input onChange={this.onQueryChange}
                       text={this.props.filters.query}
                       placeholder="Поиск..."/>
                <FiltersControl onChange={this.onFilterChange}
                                filters={this.props.filters}/>
            </div>
        )
    }

}
