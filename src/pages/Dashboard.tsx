import React from 'react';
import { Layout, Menu, Typography } from 'antd';
import Views from '../views';
import { ViewsContext } from '../context/views.context';

const { Header, Sider, Content, Footer } = Layout;

const { Title } = Typography;

function Dashboard(): React.ReactElement {
  const { viewSelected, onSelectView } = React.useContext(ViewsContext);

  return (
    <Layout>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        defaultCollapsed={false}
        style={{ height: 'auto' }}>
        <Typography>
          <div style={{ paddingLeft: '2vh' }} >
            <Title style={{ color: 'white' }} level={3}>
              PayKath
            </Title>
          </div>
        </Typography>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['budgets']}
          expandIcon={false}
          items={Object.values(Views) as any}
          onClick={e => onSelectView(e.key)}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0 }} />
        <Content style={{ height: '85vh' }} >
          {viewSelected.content}
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          PayKath ©{new Date().getFullYear()} Created by Marco Castro
        </Footer>
      </Layout>
    </Layout>
  );
}

export default Dashboard;
