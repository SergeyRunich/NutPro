import React, { Fragment, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from 'react-query'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { Button, Calendar, notification, Popconfirm, Result, Tabs } from 'antd'
import Authorize from 'components/LayoutComponents/Authorize'
import { Helmet } from 'react-helmet'
import Donut from 'components/CleanUIComponents/Donut'
import ListDataset from 'components/NutritionPRO/ListDataset'
import { getQueryName } from '../../../helpers/components'
import SettingsForm from './SettingsForm'
import ResetPasswordForm from './ResetPasswordForm'
import ChangeKitchenForm from './ChangeKitchenForm'
import AddDatasetForm from './AddDatasetForm'
import UserOrderList from './UserOrderList'
import UserCreditList from './UserCreditList'
import style from './style.module.scss'

import {
  changeIgnoreTag,
  changeUserLanguage,
  changeUserTag,
  createNewDataset,
  deleteLastKitchenHistory,
  deleteUser,
  editProfile,
  getUser,
  getUserCreditHistory,
  pushKitchenHistory,
  resetPasswordToUser,
  restoreUser,
  setCzech,
  syncBitrixUser,
  syncNewBitrixUser,
} from '../../../api/customer'

import {
  DATASET_STATUS_AVAILABLE,
  DATE_TIME_FORMAT,
  LANGUAGE_CS,
  LANGUAGE_EN,
  TAG_VIP,
  USER_ROLE_ADMIN,
  USER_ROLE_FINANCE,
  USER_ROLE_ROOT,
  USER_ROLE_SALES,
  USER_ROLE_SALES_DIRECTOR,
  USER_ROLE_TRAINER,
  USER_STATUS_OFFLINE,
  USER_STATUS_ONLINE,
} from '../../../helpers/constants'

const DEFAULT_BACKGROUND_PATH = 'resources/images/food-bg-desktop.png'

const { TabPane } = Tabs

const buildDataSetEntries = dataSet => {
  return [
    ['Users.Gender', dataSet.sex],
    ['Users.Age', dataSet.age],
    ['Users.Height', dataSet.height],
    ['Users.Weight', dataSet.weight],
    ['Users.BMR', dataSet.BMR],
    ['Users.PBF', dataSet.PBF],
    ['Users.BMI', dataSet.BMI],
    ['Users.VFA', dataSet.VFA],
    ['Users.TBW', dataSet.TBW],
    ['Users.Muscle', dataSet.muscle],
  ]
}

const buildUserDataEntries = userData => {
  return [
    ['Users.Name:', userData.name],
    ['Users.InBodyId:', userData.inBodyId],
    ['Users.Address: ', userData.address],
    ['Users.E-Mail:', userData.email],
    ['Users.Phone: ', userData.phone],
    ['Users.Tag:', userData.tag],
  ]
}

const UserProfile = () => {
  const { formatMessage } = useIntl()
  const [isAddDatasetFormVisible, setIsAddDatasetFormVisible] = useState(false)
  const [isResetPasswordModalVisible, setIsResetPasswordModalVisible] = useState(false)
  const { id: paramUserId } = useParams()

  const user = useQuery(
    getQueryName(UserProfile, 'user'),
    async () => {
      const req = await getUser(paramUserId)
      return req.json()
    },
    {
      retry: false,
      cacheTime: 0,
      onError: e =>
        notification.error({
          message: `Failed to obtain user data: ${e.message}`,
        }),
    },
  )

  const userCreditHistory = useQuery(
    getQueryName(UserProfile, 'creditHistory'),
    async () => {
      const req = await getUserCreditHistory(paramUserId)
      return req.json()
    },
    {
      retry: false,
      cacheTime: 0,
      onError: e =>
        notification.error({
          message: `Failed to obtain user credit history data: ${e.message}`,
        }),
    },
  )

  const update = () => {
    user.refetch()
    userCreditHistory.refetch()
  }

  useEffect(() => {
    update()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramUserId])

  if (user.isError || userCreditHistory.isError) {
    return (
      <Result
        status="500"
        title="500"
        subTitle={formatMessage({ id: 'Users.Sorry, the server is wrong.' })}
        extra={
          <Link to="/users">
            <Button type="primary">{formatMessage({ id: 'Users.Back Users' })}</Button>
          </Link>
        }
      />
    )
  }

  /**
   * todo: in case data is loading
   * status === 500 && !loading
   */
  if (!user.isFetched || !userCreditHistory.isFetched) {
    return (
      <Result
        status="500"
        title="500"
        subTitle={formatMessage({ id: 'Users.Sorry, the server is wrong.' })}
        extra={
          <Link to="/users">
            <Button type="primary">{formatMessage({ id: 'Users.Back Users' })}</Button>
          </Link>
        }
      />
    )
  }

  const onCreate = async values => {
    const req = await resetPasswordToUser(user.data.id, { newPassword: values.password })
    informAboutOperationResult(req, {
      successHttpStatus: 205,
      successDescriptionMessageId: 'Users.Password successfully changed!',
      callback: () => setIsResetPasswordModalVisible(false),
    })
  }

  const onEdit = async values => {
    const req = await editProfile(user.data.id, values)
    informAboutOperationResult(req, {
      successHttpStatus: 205,
      successDescriptionMessageId: 'Users.Data successfully changed!',
    })
  }

  const onChangeKitchen = async values => {
    const req = await resetPasswordToUser(user.data.id, { newPassword: values.password })
    informAboutOperationResult(req, {
      successHttpStatus: 205,
      successDescriptionMessageId: 'Users.Password successfully changed!',
      callback: () => setIsResetPasswordModalVisible(false),
    })
  }

  const toggleVipTag = async () => {
    const req = await changeUserTag(user.data.id, user.data.tag === TAG_VIP ? '' : TAG_VIP)

    informAboutOperationResult(req, {
      successHttpStatus: 200,
      successDescriptionMessageId: 'Users.Tag successfully changed!',
    })
  }

  const toggleLanguageEN = async () => {
    const req = await changeUserLanguage(
      user.data.id,
      user.data.language === LANGUAGE_CS ? LANGUAGE_EN : LANGUAGE_CS,
    )

    informAboutOperationResult(req, {
      successHttpStatus: 200,
      successDescriptionMessageId: 'Users.Language successfully changed!',
    })
  }

  const toggleRatingIgnorance = async () => {
    const req = await changeIgnoreTag(user.data.id, !user.data.isIgnoreInRating)

    informAboutOperationResult(req, {
      successHttpStatus: 200,
      successDescriptionMessageId: 'Users.Tag successfully changed!',
    })
  }

  const toggleLanguageCZ = async () => {
    const req = await setCzech(user.data.id)

    informAboutOperationResult(req, {
      successHttpStatus: 200,
      successDescriptionMessageId: 'Users.Successfully changed!',
    })
  }

  const pushKitchenToHistory = async newKitchenData => {
    if (!newKitchenData.startDate) {
      notification.error({
        message: formatMessage({ id: 'Users.Date is empty' }),
        description: formatMessage({ id: 'Users.Select date' }),
      })
      return
    }

    const req = await pushKitchenHistory({
      userId: user.data.id,
      currentKitchenId: user.data.kitchenHistory[user.data.kitchenHistory.length - 1].id,
      start: newKitchenData.startDate,
      kitchenId: newKitchenData.kitchenId,
    })

    informAboutOperationResult(req, {
      successHttpStatus: 200,
      successDescriptionMessageId: 'Users.Kitchen successfully changed!',
    })
  }

  const onDeleteLastKitchen = async () => {
    const req = await deleteLastKitchenHistory(user.data.id)

    informAboutOperationResult(req, {
      successHttpStatus: 204,
      successDescriptionMessageId: 'Users.Last record successfully changed!',
    })
  }

  const syncBitrix = async () => {
    const req = await syncBitrixUser(user.data.id)

    informAboutOperationResult(req, {
      successHttpStatus: 200,
      successDescriptionMessageId: 'Users.Request successfully send!',
    })
  }

  const onDeleteUser = async () => {
    const req = await deleteUser(user.data.id)

    informAboutOperationResult(req, {
      successHttpStatus: 204,
      successDescriptionMessageId: 'Users.User successfully deleted!',
    })
  }

  const onRestoreUser = async () => {
    const req = await restoreUser(user.data.id)

    informAboutOperationResult(req, {
      successHttpStatus: 200,
      successDescriptionMessageId: 'Users.User successfully restored!',
    })
  }

  const informAboutOperationResult = (req, params) => {
    const defaultParams = {
      successMessageId: 'global.success',
      successDescriptionMessageId: '',
      successHttpStatus: 200,
      failureMessageId: 'global.error',
      callback: null,
    }

    const effectiveParams = { ...defaultParams, ...params }

    if (req.status === effectiveParams.successHttpStatus) {
      update()
      notification.success({
        message: formatMessage({ id: effectiveParams.successMessageId }),
        description: formatMessage({ id: effectiveParams.successDescriptionMessageId }),
      })
      if (effectiveParams.callback) {
        effectiveParams.callback()
      }
    } else {
      notification.error({
        message: formatMessage({ id: effectiveParams.failureMessageId }),
        description: req.statusText,
      })
    }
  }

  const syncNewBitrix = async () => {
    const req = await syncNewBitrixUser(user.data.id)
    if (req.status === 200) {
      update()
      notification.success({
        message: formatMessage({ id: 'global.success' }),
        description: formatMessage({ id: 'Users.Request successfully send!' }),
      })
    } else {
      notification.error({
        message: formatMessage({ id: 'global.error' }),
        description: req.statusText,
      })
    }
  }

  return (
    <div>
      <div>
        <ResetPasswordForm
          visible={isResetPasswordModalVisible}
          onCreate={onCreate}
          onCancel={() => setIsResetPasswordModalVisible(false)}
        />
        <Helmet title={`${formatMessage({ id: 'Users.Profile' })} ${user.data.name}`} />
        <div className={style.profile}>
          <div className="row">
            <div className="col-xl-4">
              <div
                className={`card ${style.header}`}
                style={{ backgroundImage: `url(${DEFAULT_BACKGROUND_PATH})` }}
              >
                <div>
                  <div className="card-body text-center">
                    <p className="mt-2" style={{ fontSize: '28px' }}>
                      {formatMessage({ id: 'Users.Sales manager: ' })}
                      {user.data.sales || '-'}
                    </p>
                    {user.data.creditBalance !== 0 && (
                      <>
                        <p className="mt-2" style={{ fontSize: '20px' }}>
                          {formatMessage({ id: 'Users.Available credit balance: ' })}
                          {/* todo: localize balance amount! */}
                          <b>{user.data.creditBalance} Kč</b>
                        </p>
                      </>
                    )}
                    <p className="mt-2">
                      {`Customer created: ${moment
                        .unix(parseInt(user.data.id.substring(0, 8), 16))
                        .format(DATE_TIME_FORMAT)}`}
                    </p>
                    <p className="mt-2">
                      {user.data.status === USER_STATUS_ONLINE && (
                        <Donut type="success" name={USER_STATUS_ONLINE} />
                      )}
                      {user.data.status === USER_STATUS_OFFLINE && (
                        <Donut type="danger" name={USER_STATUS_OFFLINE} />
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <Authorize
                roles={[
                  USER_ROLE_ROOT,
                  USER_ROLE_ADMIN,
                  USER_ROLE_SALES,
                  USER_ROLE_SALES_DIRECTOR,
                  USER_ROLE_FINANCE,
                  USER_ROLE_TRAINER,
                ]}
              >
                <div className="card">
                  <div className="card-body">
                    <h5 className="mb-3 text-black">
                      <strong>{formatMessage({ id: 'Users.Actions' })}</strong>
                    </h5>
                    <div className={style.actions}>
                      <Link
                        to={`/orders/create/${user.data.id}`}
                        style={{ display: 'block', width: '100%' }}
                      >
                        <Button style={{ display: 'block', width: '100%' }}>
                          {formatMessage({ id: 'Users.Create order' })}
                        </Button>
                      </Link>
                      {user.data.paymentData.isCompany && (
                        <Link
                          to={`/b2b-order/${user.data.id}`}
                          style={{ display: 'block', width: '100%' }}
                        >
                          <Button style={{ display: 'block', width: '100%' }}>
                            {formatMessage({ id: 'Users.Create B2B order' })}
                          </Button>
                        </Link>
                      )}

                      <Button
                        style={{ display: 'block', width: '100%' }}
                        onClick={() => setIsAddDatasetFormVisible(true)}
                      >
                        {formatMessage({ id: 'Users.Add dataset' })}
                      </Button>
                      <Button style={{ display: 'block', width: '100%' }} onClick={toggleVipTag}>
                        {user.data.tag === TAG_VIP
                          ? formatMessage({ id: 'Users.Unmark as VIP' })
                          : formatMessage({ id: 'Users.Mark as VIP' })}
                      </Button>
                      <Button
                        style={{ display: 'block', width: '100%' }}
                        onClick={toggleLanguageEN}
                      >
                        {user.data.language === LANGUAGE_EN
                          ? formatMessage({ id: 'Users.Unmark as English' })
                          : formatMessage({ id: 'Users.Mark as English' })}
                      </Button>
                      {user.data.role === USER_ROLE_ROOT && (
                        <Button
                          style={{ display: 'block', width: '100%' }}
                          onClick={toggleRatingIgnorance}
                        >
                          {user.data.isIgnoreInRating
                            ? formatMessage({ id: 'Users.Unmark as Ignored' })
                            : formatMessage({ id: 'Users.Mark as Ignored' })}
                        </Button>
                      )}
                      <Button
                        style={{ display: 'block', width: '100%' }}
                        onClick={toggleLanguageCZ}
                      >
                        {user.data.isNotCzech
                          ? formatMessage({ id: 'Users.not Czech (Click set Czech)' })
                          : formatMessage({ id: 'Users.Czech (Click set not Czech)' })}
                      </Button>
                      {Boolean(user.data.bitrixId) && (
                        <Button style={{ display: 'block', width: '100%' }} onClick={syncBitrix}>
                          {formatMessage({ id: 'Users.Sync Bitrix' })}
                        </Button>
                      )}
                      {Boolean(user.data.bitrixId) && (
                        <Button style={{ display: 'block', width: '100%' }} onClick={syncNewBitrix}>
                          (NEW) Sync with Bitrix
                        </Button>
                      )}

                      <Button
                        style={{ display: 'block', width: '100%' }}
                        onClick={() => setIsResetPasswordModalVisible(true)}
                      >
                        {formatMessage({ id: 'Users.Change password' })}
                      </Button>

                      <Link
                        to={
                          user.data.activeOrder?.id
                            ? `/menu/${user.data.id}/${user.data.activeOrder.id}`
                            : `/menu/${user.data.id}`
                        }
                      >
                        <Button style={{ display: 'block', width: '100%', borderRadius: '0px' }}>
                          {formatMessage({ id: 'Users.View menu' })}
                        </Button>
                      </Link>

                      <Authorize
                        roles={[
                          USER_ROLE_ROOT,
                          USER_ROLE_ADMIN,
                          USER_ROLE_SALES_DIRECTOR,
                          USER_ROLE_FINANCE,
                        ]}
                      >
                        <Popconfirm
                          title={`Are you sure to ${
                            user.data.deleted ? 'restore' : 'delete'
                          } this user?`}
                          onConfirm={user.data.deleted ? onRestoreUser : onDeleteUser}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button
                            type="danger"
                            style={{
                              display: 'block',
                              width: '100%',
                              borderRadius: '0px 0px 5px 5px',
                            }}
                          >
                            {user.data.deleted
                              ? formatMessage({ id: 'Users.Restore' })
                              : formatMessage({ id: 'Users.Delete' })}
                          </Button>
                        </Popconfirm>
                      </Authorize>
                    </div>
                  </div>
                </div>
              </Authorize>
              <div className="card">
                <div className="card-body">
                  <h5 className="mb-3 text-black">
                    <strong>{formatMessage({ id: 'Users.Last dataset' })}</strong>
                  </h5>
                  {user.data.lastDataSet?.status === DATASET_STATUS_AVAILABLE && (
                    <div>
                      <dl className="row">
                        {buildDataSetEntries(user.data.lastDataSet.data).map(
                          ([messageId, value]) => (
                            <Fragment key={messageId}>
                              <dt key={`${messageId}-dt`} className="col-xl-3">
                                {formatMessage({ id: messageId })}
                              </dt>
                              <dd key={`${messageId}-dd`} className="col-xl-9">
                                {value || '-'}
                              </dd>
                            </Fragment>
                          ),
                        )}
                      </dl>
                      <small className="text-muted">
                        {moment.unix(user.data.lastDataSet.timestamp).format(DATE_TIME_FORMAT)}
                      </small>
                    </div>
                  )}
                  {user.data.lastDataSet?.status !== DATASET_STATUS_AVAILABLE && (
                    <p>{formatMessage({ id: 'Users.Empty' })}</p>
                  )}
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <h5 className="mb-3 text-black">
                    <strong>{formatMessage({ id: 'Users.Information' })}</strong>
                  </h5>
                  <div key={1}>
                    {buildUserDataEntries(user.data).map(([messageId, value]) => (
                      <div key={messageId}>
                        <b>{formatMessage({ id: messageId })}</b>
                        {` ${value || '-'}`}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <h5 className="mb-3 text-black">
                    <strong>{formatMessage({ id: 'Users.Calendar' })}</strong>
                  </h5>
                  <Calendar fullscreen={false} />
                </div>
              </div>
            </div>
            <div className="col-xl-8">
              <div className={`card card-body mb-4 ${style.socialInfo}`}>
                <div>
                  <h2>
                    <span className="text-black mr-2">
                      <strong>{user.data.name}</strong>
                    </span>
                    <small className="text-muted">{user.data.inBodyId}</small>
                  </h2>
                  <p className="mb-1">
                    <b>#</b>
                    {user.data.id}
                  </p>
                  <p className="mb-1">
                    {formatMessage({ id: 'Users.Address: ' })}
                    {user.data.address}
                  </p>
                  <p className="mb-1">
                    {formatMessage({ id: 'Users.Phone: ' })}
                    {user.data.phone}
                  </p>
                </div>
                <div className={style.socialCounts}>
                  <div className="text-center mr-3">
                    <h2>{Math.abs(moment(user.data.birthday).diff(moment(), 'years')) || '-'}</h2>
                    <p className="mb-0">{formatMessage({ id: 'Users.Age' })}</p>
                  </div>
                  <div className="text-center">
                    <h2>
                      {user.data.lastDataSet?.data ? user.data.lastDataSet?.data.weight : '-'}
                    </h2>
                    <p className="mb-0">{formatMessage({ id: 'Users.Weight' })}</p>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <Tabs defaultActiveKey="1">
                    <TabPane
                      tab={
                        <span>
                          <i className="icmn-history" />
                          &nbsp;
                          {formatMessage({ id: 'Users.Orders history' })}
                        </span>
                      }
                      key="1"
                    >
                      <UserOrderList userId={user.data.id} />
                    </TabPane>
                    <TabPane
                      tab={
                        <span>
                          <i className="icmn-history" />
                          &nbsp;
                          {formatMessage({ id: 'Users.Datasets history' })}
                        </span>
                      }
                      key="2"
                    >
                      <ListDataset data={user.data.dataSets} />
                    </TabPane>

                    <TabPane
                      tab={
                        <span>
                          <i className="icmn-history" />
                          &nbsp;
                          {formatMessage({ id: 'Users.Kitchen history' })}
                        </span>
                      }
                      key="3"
                    >
                      <ChangeKitchenForm
                        onCreate={onChangeKitchen}
                        current={user.data.currentKitchen}
                        kitchenHistory={user.data.kitchenHistory}
                        push={pushKitchenToHistory}
                        onDeleteLast={onDeleteLastKitchen}
                      />
                    </TabPane>
                    <TabPane
                      tab={
                        <span>
                          <i className="icmn-history" />
                          &nbsp;
                          {formatMessage({ id: 'Users.Credit balance history' })}
                        </span>
                      }
                      key="4"
                    >
                      <UserCreditList creditBalanceHistory={userCreditHistory.data} />
                    </TabPane>
                    <TabPane
                      tab={
                        <span>
                          <i className="icmn-cog" /> {formatMessage({ id: 'global.edit' })}
                        </span>
                      }
                      key="5"
                    >
                      <SettingsForm data={user.data} onSend={onEdit} />
                    </TabPane>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
        <AddDatasetForm
          visible={isAddDatasetFormVisible}
          userId={user.data.id}
          onClose={() => setIsAddDatasetFormVisible(false)}
          onCreate={createNewDataset}
          update={update}
        />
      </div>
    </div>
  )
}

export default UserProfile
