import {AfterViewInit, Component, OnInit} from '@angular/core';
import * as geo from 'd3-geo';
import * as d3 from 'd3';
import * as d3Color from 'd3-scale-chromatic';
import {geoConst} from '../geo.const';

@Component({
    selector: 'app-d3-china',
    templateUrl: './china.component.html',
    styleUrls: ['./china.component.scss']
})
export class ChinaComponent implements OnInit, AfterViewInit {
    chinaJsonFile: string = geoConst.v2.china;
    provincePath: string = geoConst.v2.provincePath;
    svg: any;
    projection: any;
    path: any;
    provinceObj: { [key: string]: { name: string, center: number[] } } = {};
    cityObj: { [key: string]: { name: string, center: number[] } } = {};
    tooltip: any;

    constructor() {
    }

    ngOnInit(): void {
    }

    ngAfterViewInit() {
        this.init().then();

    }

    async init() {
        this.svg = d3.select('#svg');
        this.tooltip = d3.select('#tooltip');
        console.log(this.svg.node());
        const style = getComputedStyle(this.svg.node());
        const width = parseInt(style.getPropertyValue('width'), 10);
        const height = parseInt(style.getPropertyValue('height'), 10);
        this.projection = geo.geoMercator()
            .scale(800)
            .center([116.405285, 39.904989])
            .translate([width / 2, height / 2]);

        this.path = geo.geoPath(this.projection);
        await this.getChinaMap();
        await this.getAllProvince();
        this.addPoint();
    }

    addText() {
        this.svg.selectAll('g')
            .append('text')
            .attr('font-size', 12)
            .attr('text-anchor', 'middle')
            .attr('x', d => {
                // @ts-ignore
                const position = this.projection(d.properties.centroid || [0, 0]);
                return position[0];
            })
            .attr('y', d => {
                // @ts-ignore
                const position = this.projection(d.properties.centroid || [0, 0]);
                return position[1];
            })
            .attr('dy', d => {
                // @ts-ignore
                if (d.properties.name === '澳门') {
                    return 15;
                }
            })
            // @ts-ignore
            .text(d => d.properties.name);

    }

    addPoint() {
        const list = Object.keys(this.provinceObj).map(key => this.provinceObj[key].center);
        this.svg.selectAll('.location')
            .data(list)
            .enter()
            .append('g')
            .attr('class', 'location')
            .attr('transform', d => {
                console.log(d);
                const coor = this.projection(d);
                return 'translate(' + coor[0] + ',' + coor[1] + ')';

            })
            .append('circle')
            .attr('r', 2)
            .attr('fill', '#e91e63')
            .attr('class', 'location');
    }

    async getProvince(path, name) {
        const data: any = await this.getJson(path);
        const colors = (i) => d3Color.interpolateGnBu(i);
        // console.log(this.svg.select('#新疆维吾尔自治区'))

        if (!data || !data.features) {
            return;
        }
        for (const feature of data.features) {
            if (!feature.properties.name) {
                continue;
            }
            this.cityObj[feature.properties.name] = {
                name: feature.properties.name,
                center: feature.properties.centroid,
            };
        }
        this.svg.append('g')
            .attr('id', name)
            .selectAll('g')
            // ts-ignore
            .data(data.features)
            .enter()
            .append('g')
            .append('path')
            .attr('d', this.path)
            // 泸州的geo数据有点问题，还待排查
            // @ts-ignore
            .attr('fill', (d, i) => {
                // return '#' + (Math.floor(Math.random() * 0xFFFFFF)).toString(16);
                return colors(i / 40);

                // return colors(i.toString());
            })
            .attr('fill-rule', 'evenodd')

            .attr('id', (d: any, i) => (d.properties || {}).name)
            .attr('stroke', '#ccc')
            .attr('stroke-width', 0.5)
            .on('mouseover', d => {
                this.tooltip.html('city：' + d.properties.name)
                    .style('left', d3.event.pageX + 20 + 'px')
                    .style('top', d3.event.pageY + 20 + 'px')
                    .style('opacity', 1);
            })
            .on('mouseout', d => {
                this.tooltip.style('opacity', 0)
                    .html('');
            });
    }

    async getChinaMap() {
        const data: any = await this.getJson(this.chinaJsonFile);
        for (const feature of data.features) {
            if (!feature.properties.name || !feature.properties.centroid) {
                continue;
            }
            this.provinceObj[feature.properties.name] = {
                name: feature.properties.name,
                center: feature.properties.centroid,
            };
        }
        this.svg.append('g').attr('id', 'china')
            .selectAll('g')
            // ts-ignore
            .data(data.features)
            .enter()
            .append('g')
            .attr('id', (d: any, i) => {
                return (d.properties || {}).name;
                // return d.priority.name;
            })
            .append('path')
            .attr('d', this.path)
            // @ts-ignore
            .attr('fill', (d, i) => {
                // return '#' + (Math.floor(Math.random() * 0xFFFFFF)).toString(16);
                // return colors(i / 40);
                return 'transparent';

                // return colors(i.toString());
            })
            .attr('fill-rule', 'evenodd')

            .attr('stroke', '#fff')
            .attr('stroke-width', 1)
            .on('mouseover', (d, i) => {
                // console.log(d3.select(this).attr('id'));
            });

    }

    async getAllProvince() {
        const data: any = await this.getJson(this.chinaJsonFile);
        for (const feature of data.features) {
            if (feature.properties && feature.properties.name) {
                await this.getProvince(this.provincePath + feature.properties.name + '.json', feature.properties.name);
            }

        }
    }

    async getJson(path: string) {
        // return await d3.json('/assets/data/china.geo.json');
        return await d3.json(path);
    }


}
