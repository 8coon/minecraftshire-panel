import React, {Component} from 'react';
import './filters-control.css';


export default class FiltersControl extends Component {

    static defaultProps = {
        filters: {favorite: false, online: false, deleted: false},
        onChange: () => {},
    };

    constructor(props) {
        super(props);

        this.onFavoriteClick = this.onFavoriteClick.bind(this);
        this.onOnlineClick = this.onOnlineClick.bind(this);
        this.onDeletedClick = this.onDeletedClick.bind(this);
    }

    toggleFilter(name) {
        this.props.onChange({...this.props.filters, [name]: !this.props.filters[name]});
    }

    onFavoriteClick() {
        this.toggleFilter('favorite');
    }

    onOnlineClick() {
        this.toggleFilter('online');
    }

    onDeletedClick() {
        this.toggleFilter('deleted');
    }

    render() {
        return (
            <div className="filters-control">
                <div className={`filters-control__filter filters-control__filter_favorite ${
                        this.props.filters.favorite ? 'filters-control__filter_active' : ''
                    }`}
                     onClick={this.onFavoriteClick}
                     title="Показать избранных персонажей">
                    <i className="fa fa-star" aria-hidden="true"/>
                </div>

                <div className={`filters-control__filter filters-control__filter_online ${
                    this.props.filters.online ? 'filters-control__filter_active' : ''
                    }`}
                     onClick={this.onOnlineClick}
                     title="Показать персонажей в сети">
                    <i className="fa fa-circle" aria-hidden="true"/>
                </div>

                <div className={`filters-control__filter filters-control__filter_deleted ${
                    this.props.filters.deleted ? 'filters-control__filter_active' : ''
                    }`}
                     onClick={this.onDeletedClick}
                     title="Показать удалённых персонажей">
                    <i className="fa fa-trash-o" aria-hidden="true"/>
                </div>
            </div>
        )
    }

}
