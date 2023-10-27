import { Spin } from 'antd';
import { useContext } from 'react';
import { ViewsContext } from '../../context/views.context';

const Loader = () => {
  const { loading } = useContext(ViewsContext);

  if (loading) {
    return (
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: '50%',
          textAlign: 'center'
        }}>
        <Spin tip="Loading" size="large">
          <div className="content" />
        </Spin>
      </div>
    );
  } else {
    return <></>;
  }
};

export default Loader;
