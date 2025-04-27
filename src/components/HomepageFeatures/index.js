import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'WordPress Tutorial',
    Svg: require('@site/static/img/subarkah-wordpress-tutorial.svg').default,
    description: (
      <>
        Tutorial seputar WordPress, theme, plugin, optimasi dan custom.
      </>
    ),
  },
  {
    title: 'Sys Admin Tutorial',
    Svg: require('@site/static/img/subarkah-server-tutorial.svg').default,
    description: (
      <>
        Tutorial seputar setup server, hosting, WP-CLI, dan optimasi server.
      </>
    ),
  },
  {
    title: 'Blogging',
    Svg: require('@site/static/img/subarkah-blog.svg').default,
    description: (
      <>
        Tulisan dan opini pribadi, silahkan baca tapi jangan diambil hati.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-vert--lg padding-horiz--xl">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
