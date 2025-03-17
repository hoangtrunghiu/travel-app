import PropTypes from 'prop-types';
import './UserStyles.scss';

function UserStyles({ children }) {
   return <div className="global-styles">{children}</div>;
}

UserStyles.propTypes = {
   children: PropTypes.node.isRequired,
};

export default UserStyles;
