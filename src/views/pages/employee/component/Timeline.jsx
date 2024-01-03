// ** Third Party Components
import Proptypes from 'prop-types'
import classnames from 'classnames'
import moment from 'moment'


const Timeline = props => {
  // ** Props
  const { userLog, tag, className } = props
  console.log(userLog, 'cc')
  // ** Custom Tagg
  const Tag = tag ? tag : 'ul'

  return (
    <Tag
      className={classnames('timeline', {
        [className]: className
      })}
    >
      {userLog?.map((item, i) => {
        const ItemTag = item.tag ? item.tag : 'li'

        return (

          <ItemTag
            key={i}
            className={classnames('timeline-item', {
              [item.className]: className
            })}
          >
            <span
              className={classnames('timeline-point', {
                [`timeline-point-${item.color}`]: item.color,
                'timeline-point-indicator': !item.icon
              })}
            >
              {item.icon ? item.icon : null}
            </span>
            <div className='timeline-event'>

              <div
                className={classnames('d-flex justify-content-between', {
                  'mb-sm-0 mb-1': item.meta
                })}
              >
                <div className='d-flex'>

                  <h6 className={`text-${item.method === 'GET' ? 'success' : item.method === 'POST' ? 'info' : item.method === 'PUT' ? 'warning' : item.method === 'DELETE' ? 'danger' : 'secondary'}`}>
                    [{item.method === 'GET' ? 'VIEW' : item.method === 'POST' ? 'CREATE' : item.method === 'PUT' ? 'UPDATE' : item.method === 'DELETE' ? 'DELETE' : 'LOGIN'}]
                  </h6>
                  <h6 className='ms-1'>
                    {item.log_name} ({item.id})
                  </h6>
                </div>

                {item.updatedAt ? (
                  <span
                    className={classnames("timeline-event-time", {
                      [item.metaClassName]: item.metaClassName,
                    })}>
                    {moment(new Date(item.updatedAt)).fromNow()}
                  </span>
                ) : null}
              </div>
              <p
                className={classnames({
                  'mb-0': i === userLog.length - 1 && !item.customContent
                })}
              >
                Module: {item.module}/{item.module_name}
              </p>
              <p className={classnames({
                'mb-0': i === userLog.length - 1 && !item.customContent
              })}>
                {item.form_id ? `Deal ID: ${item.deal_id}` : ''}
              </p>
              <p className={classnames({
                'mb-0': i === userLog.length - 1 && !item.customContent
              })}>
                {item.form_id ? `Form ID: ${item.form_id}` : ''}
              </p>
              <p className={classnames({
                'mb-0': i === userLog.length - 1 && !item.customContent
              })}>
                {item.contact_id ? `Contact ID: ${item.contact_id}` : ''}
              </p>
              {item.customContent ? item.customContent : null}
            </div>
          </ItemTag>
        )

      })}
    </Tag>
  )
}

export default Timeline

// ** PropTypes
Timeline.propTypes = {
  tag: Proptypes.string,
  className: Proptypes.string,
  data: Proptypes.array.isRequired
}
