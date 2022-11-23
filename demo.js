import React, { useMemo, useState } from 'react';
import 'antd/dist/antd.css';
import './index.css';
import { Input, Tree } from 'antd';

const { Search } = Input;
const links = [
  { title: 'Dashboard', key: '/dashboard' },
  {
    title: 'Common',
    key: 'common',
    children: [
      { title: 'Banks', key: '/banks' },
      { title: 'COA', key: '/coa' },
      { title: 'App Users', key: '/app-users/users' },
    ],
  },
  {
    title: 'ALM',
    key: 'alm',
    children: [
      { title: 'PF Segmentation', key: '/alm/pfsegmentation' },
      { title: 'Cash Flow Modelling', key: '/alm/cfmodelling' },
    ],
  },
  {
    title: 'IFRS',
    key: 'ifrs',
    children: [
      {
        title: 'Rules',
        key: 'ifrs/rules',
        children: [
          {
            title: 'IFRS Config Parameter Rules',
            key: '/ifrs/rules/ifrs-config-parameter-rules',
          },
          {
            title: 'IFRS Classification Rules',
            key: 'ifrs/rules/ifrs-classification-rules',
          },
          { title: 'Dpd Bucket Data', key: '/ifrs/rules/dpd-bucket' },
          { title: 'Stage Transfer Rules', key: '/ifrs/rules/stage-transfer' },
          { title: 'Segmentation Rules', key: '/ifrs/rules/segmentation' },
        ],
      },
      { title: 'IFRS Modelling', key: '/ifrs/modelling' },
    ],
  },
  {
    title: 'Impairment',
    key: 'impairment',
    children: [
      { title: 'Impairment', key: 'ifrs/impairment' },
      { title: 'Impairment-Review', key: 'ifrs/impairment-review' },
    ],
  },
  {
    title: 'Data Management',
    key: 'data-management',
    children: [
      { title: 'Data Load', key: 'data-management/upload-history' },
      { title: 'View Data', key: 'data-management/view-data' },
      { title: 'Stage Transform', key: 'data-management/stage-transform' },
    ],
  },

  {
    title: 'PFM',
    key: 'pfm',
    children: [
      { title: 'Custom-Report-Config', key: 'pfm/custom-report-config' },
    ],
  },
  {
    title: 'RISK CUBE DATA MODEL',
    key: 'rdm',
    children: [
      {
        title: 'Audit',
        key: '/rdm/audit',
        children: [
          { title: 'Rule Audit Copy', key: '/rdm/audit/rule-audit-copy' },
          { title: 'Rule Audit', key: '/rdm/audit/rule-audit' },
          { title: 'Session Audit', key: '/rdm/audit/session-audit' },
          { title: 'Report Audit', key: '/rdm/audit/report-audit' },
        ],
      },
      { title: 'Currencies', key: '/currencies' },
      { title: 'Countries', key: '/countries' },
      { title: 'Industry Master', key: '/industry-master' },
      { title: 'Internal Rating Scale', key: '/internal-rating-scale' },
      { title: 'Interest Rate Type', key: '/interest-rate-type' },
      { title: 'Day Count Basis', key: '/day-count-basis' },
    ],
  },
];
const dataList = [];
const generateList = (data) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const { key } = node;
    dataList.push({
      key,
      title: key,
    });
    if (node.children) {
      generateList(node.children);
    }
  }
};

generateList(links);
console.log(dataList);
const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];

    if (node.children) {
      if (node.children.some((item) => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};
const App = () => {
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const onExpand = (newExpandedKeys) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };
  const onChange = (e) => {
    const { value } = e.target;
    const newExpandedKeys = dataList
      .map((item) => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, links);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    console.log(newExpandedKeys);
    setExpandedKeys(newExpandedKeys);
    setSearchValue(value);
    setAutoExpandParent(true);
  };
  const treeData = useMemo(() => {
    const loop = (data) =>
      data.map((item) => {
        const strTitle = item.title;
        const index = strTitle.indexOf(searchValue);
        const beforeStr = strTitle.substring(0, index);
        const afterStr = strTitle.slice(index + searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span className="site-tree-search-value">{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{strTitle}</span>
          );
        if (item.children) {
          return {
            title,
            key: item.key,
            children: loop(item.children),
          };
        }
        return {
          title,
          key: item.key,
        };
      });
    return loop(links);
  }, [searchValue]);
  return (
    <div>
      <Search
        style={{
          marginBottom: 8,
        }}
        placeholder="Search"
        onChange={onChange}
      />
      <Tree
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        treeData={treeData}
      />
    </div>
  );
};
export default App;
