import axios from 'axios';
import cheerio from 'cheerio';

const REGION_URLS = {
  ak: 'http://www.ftcstats.org/2024/alaska.html',
  al: 'http://www.ftcstats.org/2024/alabama.html',
  ar: 'http://www.ftcstats.org/2024/arkansas.html',
  az: 'http://www.ftcstats.org/2024/arizona.html',
  ca: 'http://www.ftcstats.org/2024/california.html',
  calno: 'http://www.ftcstats.org/2024/california_northern.html',
  cals: 'http://www.ftcstats.org/2024/california_southern.html',
  casd: 'http://www.ftcstats.org/2024/california_san_diego.html',
  chs: 'http://www.ftcstats.org/2024/chesapeake.html',
  co: 'http://www.ftcstats.org/2024/colorado.html',
  ct: 'http://www.ftcstats.org/2024/connecticut.html',
  de: 'http://www.ftcstats.org/2024/delaware.html',
  fl: 'http://www.ftcstats.org/2024/florida.html',
  ga: 'http://www.ftcstats.org/2024/georgia.html',
  hi: 'http://www.ftcstats.org/2024/hawaii.html',
  ia: 'http://www.ftcstats.org/2024/iowa.html',
  id: 'http://www.ftcstats.org/2024/idaho.html',
  in: 'http://www.ftcstats.org/2024/indiana.html',
  ky: 'http://www.ftcstats.org/2024/kentucky.html',
  la: 'http://www.ftcstats.org/2024/louisiana.html',
  ma: 'http://www.ftcstats.org/2024/massachussets.html',
  mi: 'http://www.ftcstats.org/2024/michigan.html',
  mn: 'http://www.ftcstats.org/2024/minnesota.html',
  mt: 'http://www.ftcstats.org/2024/montana.html',
  nc: 'http://www.ftcstats.org/2024/north_carolina.html',
  nd: 'http://www.ftcstats.org/2024/north_dakota.html',
  nh: 'http://www.ftcstats.org/2024/new_hampshire.html',
  nj: 'http://www.ftcstats.org/2024/new_jersey.html',
  nm: 'http://www.ftcstats.org/2024/new_mexico.html',
  nv: 'http://www.ftcstats.org/2024/nevada.html',
  ny: 'http://www.ftcstats.org/2024/new_york.html',
  nyex: 'http://www.ftcstats.org/2024/new_york_excelsior.html',
  nyli: 'http://www.ftcstats.org/2024/new_york_long_island.html',
  nyny: 'http://www.ftcstats.org/2024/new_york_city.html',
  ok: 'http://www.ftcstats.org/2024/oklahoma.html',
  or: 'http://www.ftcstats.org/2024/oregon.html',
  pa: 'http://www.ftcstats.org/2024/pennsylvannia.html',
  ri: 'http://www.ftcstats.org/2024/rhode_island.html',
  sc: 'http://www.ftcstats.org/2024/south_carolina.html',
  tn: 'http://www.ftcstats.org/2024/tennessee.html',
  tx: 'http://www.ftcstats.org/2024/texas.html',
  txho: 'http://www.ftcstats.org/2024/texas_houston.html',
  ut: 'http://www.ftcstats.org/2024/utah.html',
  vt: 'http://www.ftcstats.org/2024/vermont.html',
  wa: 'http://www.ftcstats.org/2024/washington.html',
  wi: 'http://www.ftcstats.org/2024/wisconsin.html',
  wy: 'http://www.ftcstats.org/2024/wyoming.html',

  ab: 'http://www.ftcstats.org/2024/alberta.html',
  aus: 'http://www.ftcstats.org/2024/australia.html',
  bc: 'http://www.ftcstats.org/2024/british_columbia.html',
  bel: 'http://www.ftcstats.org/2024/belgium.html',
  bra: 'http://www.ftcstats.org/2024/brazil.html',
  chn: 'http://www.ftcstats.org/2024/china.html',
  cyp: 'http://www.ftcstats.org/2024/cyprus.html',
  gbr: 'http://www.ftcstats.org/2024/united_kingdom.html',
  grc: 'http://www.ftcstats.org/2024/greece.html',
  idn: 'http://www.ftcstats.org/2024/indonesia.html',
  ind: 'http://www.ftcstats.org/2024/india.html',
  isr: 'http://www.ftcstats.org/2024/israel.html',
  ita: 'http://www.ftcstats.org/2024/italy.html',
  jam: 'http://www.ftcstats.org/2024/jamaica.html',
  kaz: 'http://www.ftcstats.org/2024/kazakhstan.html',
  ly: 'http://www.ftcstats.org/2024/libya.html',
  mad: 'http://www.ftcstats.org/2024/military_and_diplomatic.html',
  mar: 'http://www.ftcstats.org/2024/morocco.html',
  mex: 'http://www.ftcstats.org/2024/mexico.html',
  mys: 'http://www.ftcstats.org/2024/malaysia.html',
  nga: 'http://www.ftcstats.org/2024/nigeria.html',
  nld: 'http://www.ftcstats.org/2024/netherlands.html',
  nzl: 'http://www.ftcstats.org/2024/new_zealand.html',
  on: 'http://www.ftcstats.org/2024/ontario.html',
  pr: 'http://www.ftcstats.org/2024/puerto_rico.html',
  qat: 'http://www.ftcstats.org/2024/qatar.html',
  qc: 'http://www.ftcstats.org/2024/quebec.html',
  rou: 'http://www.ftcstats.org/2024/romania.html',
  skr: 'http://www.ftcstats.org/2024/south_korea.html',
  tha: 'http://www.ftcstats.org/2024/thailand.html',
  twn: 'http://www.ftcstats.org/2024/taiwan.html',
  vnm: 'http://www.ftcstats.org/2024/vietnam.html',
  zaf: 'http://www.ftcstats.org/2024/south_africa.html',
};

const scrapeTopScores = async (region) => {
  const url = REGION_URLS[region];

  if (!url) {
    throw new Error('Invalid region');
  }

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const scores = [];
    $('table tr').each((index, element) => {
      if (index === 0) return;
      if (index > 10) return false;

      const cells = $(element).find('td');
      const score = {
        score: $(cells[0]).text(),
        auto: $(cells[1]).text(),
        teleOp: $(cells[2]).text(),
        end: $(cells[3]).text(),
        autoTaskPts: $(cells[4]).text(),
        autoPixels: $(cells[5]).text(),
        telePixels: $(cells[6]).text(),
        teleBonus: $(cells[7]).text(),
        dronePts: $(cells[8]).text(),
        hang: $(cells[9]).text(),
        teams: [$(cells[10]).text().split(" ")[0], $(cells[11]).text().split(" ")[0], $(cells[12]).text().split(" ")[0]],
        event: $(cells[13]).text(),
      };

      scores.push(score);
    });

    return scores;
  } catch (error) {
    console.error(`Error creating leaderboard. Try again in a bit, and if this is still not working, open an issue on the GitHub repository @ github.com/shrysjain/ftc-leaderboard/issues/new - rntas${i+1}`);
    return [];
  }
};

export default scrapeTopScores;
